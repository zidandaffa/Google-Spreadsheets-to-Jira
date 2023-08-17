# Create Jira Ticket from Google Spreadsheet

## Description
This repository contains an automation script that enables you to automatically create or update Jira tickets based on data in a Google Spreadsheet. This script is designed as a foundation that can be further developed to achieve more complex functionalities that suit your needs.

## Precondition
Before you begin, ensure you have prepared:
1. Google Account: You need a Google account to access Google Sheets and Google Apps Script.
2. Jira Account: You need to have a Jira account with sufficient permissions to create or update tickets.

## Installation
Here are the steps to install and run the script:
1. Open Google Sheets and open the spreadsheet where you want to automate Jira ticket creation.
2. In the top toolbar, select "Extensions" and then choose "Apps Script" to open the Script Editor.
3. Copy the code form this repository and paste it into the Script Editor.
4. Generate the Token key using https://id.atlassian.com/manage/api-tokens.
4. Replace all placeholders like `<<PROJECT_KEY>>`, `<<JIRA_INSTANCE>>`, `<<JIRA_EMAIL>>`, and `<<JIRA_API_TOKEN>>` with your actual Jira information.
5. Select "File" in the Script Editor's toolbar, and then choose "Save" to save the script.
6. Give a name to your script project, for example, "CreateJiraTickets."
7. Set up a trigger according to your preference, such as "From spreadsheet" -> "On edit" -> "CreateJiraTickets" (the function name you provided).
8. If this is the first time you are running the script, you might be prompted to grant permissions. Follow the provided steps to grant the script access to your Google Sheets and Jira account.

## Advanced Development
This script serves as a foundation that can be further developed to match your specific needs. You can add additional features, integrate with other services, or optimize workflows to accommodate your project's complexity.
