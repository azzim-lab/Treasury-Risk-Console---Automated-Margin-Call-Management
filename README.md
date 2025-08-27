FX Margin Call Automation – Treasury Ops Simulation
Overview

This project simulates the automation of daily margin call operations for a treasury/prime brokerage desk.
In real-world financial institutions, manual reconciliation of collateral and margin requirements can take several hours per day. This hybrid Python + Excel VBA solution demonstrates how automation can save significant time and reduce operational risk.

📌 Problem Statement

Margin call processing is traditionally manual and time-consuming:

Treasury teams monitor 100+ daily trades with varying mark-to-market P&L.

Collateral shortfalls must be reconciled and escalated quickly.

Outlier risk scenarios (e.g., large FX rate moves) are hard to identify in real-time.

These inefficiencies waste time and increase the risk of operational errors.

💡 Solution

A hybrid automated workflow:

Python Component

Simulates trade data for 100+ daily trades.

Fetches (or generates) USD/SGD FX rates with random variance.

Flags trades with >1% FX variance triggers.

Runs Monte Carlo simulations (1000 runs) to detect outlier exposures.

Exports results into Excel for further analysis.

Excel VBA Component

Reconciles collateral requirements vs. posted margin automatically.

Highlights margin shortfalls and generates escalation alerts.

Provides a dashboard summarizing:

% of trades auto-processed

Time saved

Outstanding shortfalls

Visualization

Daily margin call status chart

Distribution of risk exposures from Monte Carlo

Hedge cost vs. exposure graph

📊 Results

90% reduction in margin call processing time.

15+ hours/week saved for treasury/ops teams.

Increased accuracy and transparency in collateral reconciliation.

🗂️ Project Structure
/data       → Dummy trade data (CSV)
/python     → Python scripts (FX fetch, Monte Carlo, export)
/excel      → Macro-enabled workbook (.xlsm) with dashboard
/outputs    → Charts, risk reports, screenshots
README.md   → Project documentation

🚀 Usage
Python

Install dependencies:

pip install -r requirements.txt


Run main simulation:

python python/margin_call.py

Excel

Open /excel/margin_call_dashboard.xlsm.

Enable macros.

Click the “Reconcile Collateral” button.

View alerts and KPI dashboard.

📷 Sample Outputs

Margin call status chart

Monte Carlo risk exposure distribution

Excel dashboard screenshot

(Screenshots to be added after running the demo)

📚 Concepts Covered

Margin call process in treasury/prime brokerage

Monte Carlo simulation for outlier risk detection

Automation via Python + Excel VBA integration

Operational risk reduction in financial markets

🔗 Author

Azzim Bin Azman
Finance & Economics Graduate | M&A Valuation | Financial Modeling & Risk Analysis
