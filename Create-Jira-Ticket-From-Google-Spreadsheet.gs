function createJiraTicketFromSheet() {
  // Mendapatkan Sheet aktif dengan nama 
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("<<Sheet1>>");
  
  // Mengambil nomor baris terakhir dan kolom terakhir
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  
  // Penanda untuk menunjukkan apakah pesan peringatan telah ditampilkan
  var sendingAlertShown = false;
  
  // Membaca setiap baris data, dimulai dari baris kedua (indeks 2)
  for (var row = 2; row <= lastRow; row++) {
    // Mengambil data dari kolom pertama hingga kolom terakhir
    var rowData = sheet.getRange(row, 1, 1, lastColumn).getValues()[0];
    
    // Mendapatkan nilai dari setiap kolom untuk baris saat ini
    var summary = rowData[2]; // Mengambil data dari kolom ke-3 (indeks 2)
    var actual = rowData[3]; // Mengambil data dari kolom ke-4 (indeks 3)
    var expected = rowData[4]; // Mengambil data dari kolom ke-5 (indeks 4)
    var evidence = rowData[5]; // Mengambil data dari kolom ke-6 (indeks 5)
    var sprint = rowData[6]; // Mengambil data dari kolom ke-7 (indeks 6)
    var issueType = rowData[7]; // Mengambil data dari kolom ke-8 (indeks 7)
    var severity = rowData[8]; // Mengambil data dari kolom ke-9 (indeks 8)
    var deploy = rowData[9]; // Mengambil data dari kolom ke-10 (indeks 9)
    var linkTicket = rowData[10]; // Mengambil data dari kolom ke-11 (indeks 10)

    // Pengecekan apakah tiket Jira harus dibuat atau diperbarui
    if (deploy.toLowerCase() === 'yes' && (summary !== '' && actual !== '' && expected !== '')) {
      // Konfigurasi informasi tiket Jira
      var projectKey = '<<PROJECT_KEY>>'; // Kode projek Jira
      var jiraUrl = linkTicket !== '' ? 'https://<<JIRA_INSTANCE>>.atlassian.net/rest/api/2/issue/' + linkTicket.split('/').pop() : 'https://<<JIRA_INSTANCE>>.atlassian.net/rest/api/2/issue/';
      var username = '<<JIRA_EMAIL>>'; // Email Jira
      var apiToken = '<<JIRA_API_TOKEN>>'; // Token API Jira
      
      // Konfigurasi headers untuk permintaan HTTP
      var headers = {
        'Authorization': 'Basic ' + Utilities.base64Encode(username + ':' + apiToken),
        'Content-Type': 'application/json'
      };

      // Data yang akan dikirim dalam permintaan HTTP
      var data = {
        "fields": {
          "project": {
            "key": projectKey,
          },
          "summary": summary,
          "description": '*Actual Condition :* \n' + actual + '\n *Expected Condition :* \n' + expected + '\n *Evidence :* \n' + evidence + '\n *Severity :* \n' + severity,
          "issuetype": {
            "name": issueType
          },
          "customfield_10020": sprint,
          "priority": {
            "name": severity,
          }
        }
      };

      // Konfigurasi options untuk permintaan HTTP
      var options = {
        'method': linkTicket !== '' ? 'PUT' : 'POST', // Memilih metode PUT atau POST
        'headers': headers,
        'payload': JSON.stringify(data)
      };
      
      // Melakukan permintaan HTTP ke API Jira
      var response = UrlFetchApp.fetch(jiraUrl, options);
      
      // Menangani respons dari API Jira
      if (response.getResponseCode() == 201 || response.getResponseCode() == 200) {
        // Mengambil informasi tiket Jira yang baru
        var responseData = JSON.parse(response.getContentText());
        var jiraIssueKey = responseData.key;
        var jiraIssueUrl = "https://<<JIRA_INSTANCE>>.atlassian.net/browse/" + jiraIssueKey;
        
        // Mengupdate kolom "Link Ticket" dengan URL ticket Jira
        sheet.getRange(row, 11).setValue(jiraIssueUrl);
      }
    }
    // Kasus ketika tiket tidak dapat dibuat
    // Jika kondisi setidaknya salah satu dari kolom summary, actual, atau expected kosong dan belum memiliki "Link Ticket", tetapi Deploy to Jira diubah menjadi "yes"
    else if (linkTicket === '' && deploy.toLowerCase() === 'yes' && (summary === '' || actual === '' || expected === '')) {
      // Mengubah kolom "Deploy" menjadi "No"
      sheet.getRange(row, 10).setValue("No");
      
      // Menampilkan pesan peringatan jika diperlukan
      if (!sendingAlertShown) {
        sendingAlertShown = true;
        SpreadsheetApp.getUi().alert("Gagal membuat tiket!", "Sebelum membuat tiket di Jira, harap mengisi kolom Summary, Actual, dan Expected terlebih dahulu.", SpreadsheetApp.getUi().ButtonSet.OK);
      }
      return; // Menghentikan proses lebih lanjut jika ada kesalahan
    }
  }
}