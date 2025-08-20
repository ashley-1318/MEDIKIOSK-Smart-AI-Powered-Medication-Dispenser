from __future__ import annotations
from pathlib import Path
import typer
from transformers import (
    AutoModelForTokenClassification,
    AutoTokenizer,
    DataCollatorForTokenClassification,
    Trainer,
    TrainingArguments,
)
from .data_loader import load_from_jsonl, create_ner_dataset
from .focal_loss import FocalLoss

# --- Config ---
MODEL_NAME = "distilbert-base-uncased"  # Use a simpler model that doesn't have tokenizer issues
LABEL_LIST = [
    "O", "B-DRUG", "I-DRUG", "B-STRENGTH", "I-STRENGTH", "B-DOSE", "I-DOSE",
    "B-FREQ", "I-FREQ", "B-DURATION", "I-DURATION", "B-ROUTE", "I-ROUTE"
]
# --- End Config ---

app = typer.Typer(add_completion=False)

@app.command()
def train(
    data_path: Path = typer.Option(..., help="Path to JSONL annotation file."),
    output_dir: Path = typer.Option("artifacts/ner_model", help="Directory to save trained model."),
    epochs: int = typer.Option(3, help="Number of training epochs."),
    batch_size: int = typer.Option(8, help="Training batch size."),
    lr: float = typer.Option(2e-5, help="Learning rate."),
    use_focal_loss: bool = typer.Option(False, help="Use Focal Loss instead of CrossEntropy."),
):
    """
    Fine-tune a DeBERTa-v3 model for token classification (NER).
    """
    # 1. Load and prepare data
    raw_data = load_from_jsonl(data_path)
    id2label = {i: label for i, label in enumerate(LABEL_LIST)}
    label2id = {label: i for i, label in enumerate(LABEL_LIST)}
    
    # Convert ner_tags from strings to integers
    for item in raw_data:
        item["ner_tags"] = [label2id[tag] for tag in item["ner_tags"]]

    dataset = create_ner_dataset(raw_data, LABEL_LIST)
    
    # 2. Initialize tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForTokenClassification.from_pretrained(
        MODEL_NAME, num_labels=len(LABEL_LIST), id2label=id2label, label2id=label2id
    )

    # 3. Set up trainer
    data_collator = DataCollatorForTokenClassification(tokenizer=tokenizer)
    
    training_args = TrainingArguments(
        output_dir=str(output_dir),
        learning_rate=lr,
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        num_train_epochs=epochs,
        weight_decay=0.01,
        eval_strategy="epoch",  # Fixed: changed from evaluation_strategy
        save_strategy="epoch",
        load_best_model_at_end=True,
        push_to_hub=False,
    )

    trainer_cls = Trainer
    if use_focal_loss:
        class FocalLossTrainer(Trainer):
            def compute_loss(self, model, inputs, return_outputs=False, num_items_in_batch=None):
                labels = inputs.pop("labels")
                outputs = model(**inputs)
                logits = outputs.get("logits")
                loss_fct = FocalLoss(ignore_index=-100)  # Use standard ignore index for padding
                # Reshape for token classification - use the model's config
                num_labels = len(LABEL_LIST)  # Use the known number of labels
                active_logits = logits.view(-1, num_labels)
                active_labels = labels.view(-1)
                loss = loss_fct(active_logits, active_labels)
                return (loss, outputs) if return_outputs else loss
        trainer_cls = FocalLossTrainer

    trainer = trainer_cls(
        model=model,
        args=training_args,
        train_dataset=dataset["train"],
        eval_dataset=dataset["validation"],
        data_collator=data_collator,
    )

    # 4. Train
    trainer.train()
    
    # 5. Save
    trainer.save_model(str(output_dir))
    tokenizer.save_pretrained(str(output_dir))
    print(f"Model saved to {output_dir}")


if __name__ == "__main__":
    app()
