import os

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.nacmee_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# Path to your CSV files
DATA_DIR = "data"

# Collect all .csv files in the directory
csv_files = [f for f in os.listdir(DATA_DIR) if f.endswith(".csv")]

# Load and combine all data
df_list = []
for file in csv_files:
    path = os.path.join(DATA_DIR, file)
    df = pd.read_csv(path)
    df_list.append(df)

# Concatenate all DataFrames into one
all_data = pd.concat(df_list, ignore_index=True)

# Drop rows with missing data
all_data.dropna(subset=["prompt", "tool"], inplace=True)

# Check that required columns exist
if not {"prompt", "tool"}.issubset(all_data.columns):
    raise ValueError("Each CSV must contain 'prompt' and 'tool' columns.")

# Split data
X = all_data["prompt"]
y = all_data["tool"]

# Build model
model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(X, y)

# Save model
os.makedirs("model", exist_ok=True)
joblib.dump(model, "model/classifier.joblib")

print("✅ Model trained on all CSVs and saved to model/classifier.joblib")
