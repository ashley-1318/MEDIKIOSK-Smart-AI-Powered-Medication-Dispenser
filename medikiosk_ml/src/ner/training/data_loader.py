from __future__ import annotations
from typing import List, Dict
from pathlib import Path
import json
from datasets import Dataset, DatasetDict, ClassLabel, Sequence, Value, Features
from sklearn.model_selection import train_test_split


def create_ner_dataset(
    data: List[Dict],
    label_list: List[str],
    test_size: float = 0.2,
    val_size: float = 0.25,
) -> DatasetDict:
    """
    Converts a list of annotated data into a Hugging Face DatasetDict.
    Assumes `data` is a list of dicts, each with "tokens" and "ner_tags" (int IDs).
    """
    # Split data: train -> (train, test) -> (train, val)
    train_val, test_data = train_test_split(data, test_size=test_size, random_state=42)
    train_data, val_data = train_test_split(train_val, test_size=val_size, random_state=42)

    def gen(split_data):
        for record in split_data:
            yield record

    # Define features
    features = Features({
        "tokens": Sequence(Value("string")),
        "ner_tags": Sequence(ClassLabel(names=label_list)),
    })

    # Create datasets
    train_ds = Dataset.from_generator(lambda: gen(train_data), features=features)
    val_ds = Dataset.from_generator(lambda: gen(val_data), features=features)
    test_ds = Dataset.from_generator(lambda: gen(test_data), features=features)

    return DatasetDict(
        train=train_ds,
        validation=val_ds,
        test=test_ds
    )


def load_from_jsonl(path: Path) -> List[Dict]:
    with path.open("r", encoding="utf-8") as f:
        return [json.loads(line) for line in f]
