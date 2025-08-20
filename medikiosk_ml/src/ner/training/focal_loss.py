from __future__ import annotations
import torch
from torch import nn


class FocalLoss(nn.Module):
    """
    Focal Loss, as described in https://arxiv.org/abs/1708.02002.
    It modifies the cross-entropy loss to focus on hard-to-classify examples.
    """
    def __init__(self, gamma: float = 2.0, weight: torch.Tensor | None = None, reduction: str = "mean", ignore_index: int = -100):
        super().__init__()
        self.gamma = gamma
        self.weight = weight
        self.reduction = reduction
        self.ignore_index = ignore_index

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        # Apply cross entropy with ignore_index to handle padding tokens
        ce_loss = nn.functional.cross_entropy(
            logits, targets, weight=self.weight, reduction="none", ignore_index=self.ignore_index
        )
        
        # Create mask to exclude ignored indices from focal loss calculation
        mask = (targets != self.ignore_index)
        
        # Only compute focal loss for non-ignored tokens
        valid_ce_loss = ce_loss[mask]
        if valid_ce_loss.numel() == 0:
            return torch.tensor(0.0, device=logits.device, requires_grad=True)
            
        pt = torch.exp(-valid_ce_loss)
        focal_loss = (1 - pt) ** self.gamma * valid_ce_loss

        if self.reduction == "mean":
            return focal_loss.mean()
        elif self.reduction == "sum":
            return focal_loss.sum()
        else:
            # Return focal loss with original shape, filling ignored positions with 0
            full_focal_loss = torch.zeros_like(ce_loss)
            full_focal_loss[mask] = focal_loss
            return full_focal_loss
