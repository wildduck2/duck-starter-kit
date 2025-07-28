import sys

import joblib
import numpy as np

# Load the model
model = joblib.load("model/classifier.joblib")


def classify(prompt: str) -> list[str]:
    # Get probabilities
    probs = model.predict_proba([prompt])[0]

    # Get indices of top 2
    top_indices = np.argsort(probs)[-2:][::-1]

    # Get class labels
    top_classes = model.classes_[top_indices]

    return top_classes.tolist()


if __name__ == "__main__":
    # If run from CLI
    prompt = " ".join(sys.argv[1:])
    result = classify(prompt)
    print(result)
