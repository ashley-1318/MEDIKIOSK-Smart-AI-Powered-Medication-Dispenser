#!/usr/bin/env python3
"""
Test script to verify the focal loss implementation and training integration.
"""
import torch
import sys
from pathlib import Path

# Add src to path
sys.path.append(str(Path(__file__).parent / "src"))

from src.ner.training.focal_loss import FocalLoss


def test_focal_loss_basic():
    """Test basic focal loss functionality."""
    print("Testing basic focal loss functionality...")
    
    focal_loss = FocalLoss(gamma=2.0)
    
    # Create sample data
    batch_size, seq_len, num_classes = 4, 8, 5
    logits = torch.randn(batch_size * seq_len, num_classes)
    targets = torch.randint(0, num_classes, (batch_size * seq_len,))
    
    # Compute loss
    loss = focal_loss(logits, targets)
    
    assert isinstance(loss, torch.Tensor), "Loss should be a tensor"
    assert loss.item() >= 0, "Loss should be non-negative"
    print(f"✓ Basic focal loss: {loss.item():.4f}")


def test_focal_loss_with_ignore_index():
    """Test focal loss with ignore index for padding tokens."""
    print("Testing focal loss with ignore index...")
    
    focal_loss = FocalLoss(gamma=2.0, ignore_index=-100)
    
    # Create sample data with padding tokens
    batch_size, seq_len, num_classes = 4, 8, 5
    logits = torch.randn(batch_size * seq_len, num_classes)
    targets = torch.randint(0, num_classes, (batch_size * seq_len,))
    
    # Set some targets to ignore index (padding)
    targets[0:4] = -100  # First 4 tokens are padding
    
    # Compute loss
    loss = focal_loss(logits, targets)
    
    assert isinstance(loss, torch.Tensor), "Loss should be a tensor"
    assert loss.item() >= 0, "Loss should be non-negative"
    print(f"✓ Focal loss with ignore index: {loss.item():.4f}")


def test_focal_loss_reductions():
    """Test different reduction methods."""
    print("Testing focal loss reduction methods...")
    
    # Create sample data
    logits = torch.randn(10, 5)
    targets = torch.randint(0, 5, (10,))
    
    # Test mean reduction
    focal_loss_mean = FocalLoss(gamma=2.0, reduction="mean")
    loss_mean = focal_loss_mean(logits, targets)
    
    # Test sum reduction
    focal_loss_sum = FocalLoss(gamma=2.0, reduction="sum")
    loss_sum = focal_loss_sum(logits, targets)
    
    # Test none reduction
    focal_loss_none = FocalLoss(gamma=2.0, reduction="none")
    loss_none = focal_loss_none(logits, targets)
    
    assert loss_mean.shape == torch.Size([]), "Mean reduction should return scalar"
    assert loss_sum.shape == torch.Size([]), "Sum reduction should return scalar"
    assert loss_none.shape == targets.shape, "None reduction should preserve shape"
    
    print(f"✓ Mean reduction: {loss_mean.item():.4f}")
    print(f"✓ Sum reduction: {loss_sum.item():.4f}")
    print(f"✓ None reduction shape: {loss_none.shape}")


def test_focal_loss_vs_cross_entropy():
    """Compare focal loss with standard cross entropy."""
    print("Comparing focal loss with cross entropy...")
    
    # Create sample data
    logits = torch.randn(10, 5)
    targets = torch.randint(0, 5, (10,))
    
    # Compute focal loss (gamma=0 should approximate cross entropy)
    focal_loss = FocalLoss(gamma=0.0)
    focal_loss_value = focal_loss(logits, targets)
    
    # Compute standard cross entropy
    ce_loss = torch.nn.functional.cross_entropy(logits, targets)
    
    # They should be approximately equal when gamma=0
    diff = abs(focal_loss_value.item() - ce_loss.item())
    assert diff < 0.01, f"Focal loss with gamma=0 should approximate CE loss, diff: {diff}"
    
    print(f"✓ Focal loss (γ=0): {focal_loss_value.item():.4f}")
    print(f"✓ Cross entropy: {ce_loss.item():.4f}")
    print(f"✓ Difference: {diff:.6f}")


if __name__ == "__main__":
    print("Running focal loss tests...")
    print("=" * 50)
    
    try:
        test_focal_loss_basic()
        print()
        test_focal_loss_with_ignore_index()
        print()
        test_focal_loss_reductions()
        print()
        test_focal_loss_vs_cross_entropy()
        print()
        print("=" * 50)
        print("✅ All tests passed! Focal loss implementation is working correctly.")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        sys.exit(1)
