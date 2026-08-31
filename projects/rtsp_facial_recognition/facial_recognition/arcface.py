"""ArcFace (Additive Angular Margin Loss) & Backbone Deep Neural Network in PyTorch."""

import math
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Tuple


class ArcFaceLoss(nn.Module):
    """Additive Angular Margin Loss (Deng et al., CVPR 2019).
    L = -log( exp(s * cos(theta_yi + m)) / (exp(s * cos(theta_yi + m)) + sum_{j != yi} exp(s * cos(theta_j))) )
    """

    def __init__(self, in_features: int = 512, out_features: int = 10000, scale: float = 64.0, margin: float = 0.50):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.scale = scale
        self.margin = margin

        self.weight = nn.Parameter(torch.FloatTensor(out_features, in_features))
        nn.init.xavier_uniform_(self.weight)

        self.cos_m = math.cos(margin)
        self.sin_m = math.sin(margin)
        self.th = math.cos(math.pi - margin)
        self.mm = math.sin(math.pi - margin) * margin

    def forward(self, embedding: torch.Tensor, label: torch.Tensor) -> torch.Tensor:
        # 1. Normalisation sur la sphère S^{d-1}
        norm_x = F.normalize(embedding, p=2, dim=1)
        norm_w = F.normalize(self.weight, p=2, dim=1)

        # 2. cos(theta) = x_norm . w_norm
        cosine = F.linear(norm_x, norm_w)
        sine = torch.sqrt(torch.clamp(1.0 - torch.pow(cosine, 2), min=1e-9, max=1.0))

        # 3. cos(theta + m) = cos(theta)*cos(m) - sin(theta)*sin(m)
        phi = cosine * self.cos_m - sine * self.sin_m
        phi = torch.where(cosine > self.th, phi, cosine - self.mm)

        # 4. One-hot target penalty
        one_hot = torch.zeros(cosine.size(), device=embedding.device)
        one_hot.scatter_(1, label.view(-1, 1).long(), 1.0)

        output = (one_hot * phi) + ((1.0 - one_hot) * cosine)
        output *= self.scale

        loss = F.cross_entropy(output, label)
        return loss


class ResNetFaceBackbone(nn.Module):
    """Backbone d'extraction 512-D avec convolution résiduelle et normalisation L2."""

    def __init__(self, embedding_dim: int = 512):
        super().__init__()
        self.embedding_dim = embedding_dim
        self.features = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(64),
            nn.PReLU(64),
            nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1, bias=False),
            nn.BatchNorm2d(128),
            nn.PReLU(128),
            nn.AdaptiveAvgPool2d((1, 1)),
        )
        self.fc = nn.Linear(128, embedding_dim, bias=False)
        self.bn = nn.BatchNorm1d(embedding_dim)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        h = self.features(x)
        h = torch.flatten(h, 1)
        raw_emb = self.bn(self.fc(h))
        # Normalisation unitaire L2 obligatoire pour ArcFace
        return F.normalize(raw_emb, p=2, dim=1)
