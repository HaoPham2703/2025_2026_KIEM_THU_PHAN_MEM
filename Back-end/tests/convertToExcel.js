const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Đọc file txt
const txtPath = path.join(__dirname, "Test_Case_Report_Auth.txt");
const txtContent = fs.readFileSync(txtPath, "utf-8");

// Parse dữ liệu
const lines = txtContent.split("\n");
const worksheetData = [];

// Thêm header rows
worksheetData.push([
  "Module Code",
  "Module1 - Authentication & Registration",
  "",
  "",
  "",
  "",
  "",
  "",
]);
worksheetData.push([
  "Test requirement",
  "Kiểm thử các chức năng đăng ký, đăng nhập, xác thực tài khoản, quên mật khẩu và các middleware bảo vệ route",
  "",
  "",
  "",
  "",
  "",
  "",
]);
worksheetData.push(["Tester", "", "", "", "", "", "", ""]);
worksheetData.push([
  "",
  "Pass",
  "Fail",
  "Untested",
  "N/A",
  "Number of Test cases",
  "",
  "",
]);
worksheetData.push(["", "6", "31", "0", "0", "37", "", ""]);
worksheetData.push([]); // Empty row
worksheetData.push([
  "ID",
  "Test Case Description",
  "Test Case Procedure",
  "Expected Output",
  "Inter-test case Dependence",
  "Result",
  "Test date",
  "Note",
]);

// Helper function để parse multi-line field
function parseMultiLineField(lines, startIndex, columnIndex) {
  let text = "";
  let i = startIndex;
  let firstLine = true;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Dừng nếu gặp test case mới hoặc function mới
    if (trimmed.includes("[Module1 -") || trimmed.startsWith("Function")) {
      break;
    }

    // Skip empty lines
    if (trimmed === "") {
      i++;
      continue;
    }

    const parts = line.split("\t");
    if (parts.length > columnIndex && parts[0].trim() === "") {
      let fieldText = parts[columnIndex] ? parts[columnIndex].trim() : "";
      fieldText = fieldText.replace(/^"|"$/g, "");

      if (fieldText) {
        if (firstLine) {
          text = fieldText;
          firstLine = false;
        } else {
          text += "\n" + fieldText;
        }
      }
    } else {
      // Không phải phần tiếp theo của field này
      break;
    }
    i++;
  }

  return { text: text.trim(), nextIndex: i - 1 };
}

// Parse test cases từ file txt
let currentFunction = "";

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Skip header rows
  if (
    trimmed === "" ||
    line.includes("Module Code") ||
    line.includes("Test requirement") ||
    line.includes("Tester") ||
    line.includes("Pass\tFail") ||
    line.includes("ID\tTest Case Description")
  ) {
    continue;
  }

  // Detect Function
  if (trimmed.startsWith("Function")) {
    // Extract function name (bỏ "Function X: ")
    const functionMatch = trimmed.match(/Function\s+[A-Z]:\s*(.+)/);
    if (functionMatch) {
      currentFunction = functionMatch[1].trim();
      // Thêm dòng Function vào worksheet (chỉ cột đầu tiên)
      worksheetData.push([currentFunction, "", "", "", "", "", "", ""]);
    }
    continue;
  }

  // Detect test case ID
  if (trimmed.includes("[Module1 -")) {
    const parts = line.split("\t");

    const testCase = {
      id: parts[0] ? parts[0].trim() : "",
      description: "",
      procedure: "",
      expected: "",
      dependence: "",
      result: "",
      note: "",
    };

    // Parse ID
    testCase.id = parts[0] ? parts[0].trim() : "";

    // Parse Description - gộp các dòng lại thành một dòng với ": "
    if (parts.length > 1) {
      let descLines = [];
      let j = i;
      let foundEnd = false;

      // Đọc description từ dòng hiện tại
      let firstDesc = parts[1] ? parts[1].trim() : "";
      firstDesc = firstDesc.replace(/^"|"$/g, "");
      if (firstDesc) {
        descLines.push(firstDesc);
      }

      // Đọc các dòng tiếp theo của description
      j = i + 1;
      while (
        j < lines.length &&
        !lines[j].includes("[Module1 -") &&
        !lines[j].trim().startsWith("Function")
      ) {
        const nextLine = lines[j];
        const nextTrimmed = nextLine.trim();

        if (nextTrimmed === "") {
          j++;
          continue;
        }

        const nextParts = nextLine.split("\t");
        // Nếu cột đầu rỗng và cột 2 có nội dung, đó là phần tiếp theo của description
        if (nextParts.length > 1 && nextParts[0].trim() === "") {
          const nextDesc = nextParts[1] ? nextParts[1].trim() : "";
          if (nextDesc) {
            const cleanDesc = nextDesc.replace(/^"|"$/g, "");
            if (cleanDesc) {
              descLines.push(cleanDesc);
              // Nếu có dấu ngoặc kép đóng, đã hết description
              if (nextDesc.endsWith('"') && !nextDesc.startsWith('"')) {
                foundEnd = true;
                j++;
                break;
              }
            }
          }
        } else {
          // Không phải phần tiếp theo của description
          break;
        }
        j++;
      }

      // Gộp description: dòng đầu là tiêu đề, các dòng sau là mô tả
      if (descLines.length > 0) {
        const title = descLines[0];
        const description = descLines.slice(1).join(" ").trim();
        testCase.description = description ? `${title}: ${description}` : title;
      }

      i = j - 1;
    }

    // Parse Procedure
    if (parts.length > 2) {
      const procResult = parseMultiLineField(lines, i + 1, 2);
      let procText = parts[2] ? parts[2].trim() : "";
      procText = procText.replace(/^"|"$/g, "");

      if (procResult.text) {
        procText = procText
          ? procText + "\n" + procResult.text
          : procResult.text;
        i = procResult.nextIndex;
      }

      testCase.procedure = procText.trim();
    }

    // Parse Expected Output
    if (parts.length > 3) {
      const expResult = parseMultiLineField(lines, i + 1, 3);
      let expText = parts[3] ? parts[3].trim() : "";
      expText = expText.replace(/^"|"$/g, "");

      if (expResult.text) {
        expText = expText ? expText + "\n" + expResult.text : expResult.text;
        i = expResult.nextIndex;
      }

      testCase.expected = expText.trim();
    }

    // Parse Dependence
    if (parts.length > 4) {
      testCase.dependence = parts[4] ? parts[4].trim() : "";
    }

    // Parse Result
    if (parts.length > 5) {
      testCase.result = parts[5] ? parts[5].trim() : "";
    }

    // Parse Note (cột 8, index 7)
    if (parts.length > 7) {
      const noteResult = parseMultiLineField(lines, i + 1, 7);
      let noteText = parts[7] ? parts[7].trim() : "";
      noteText = noteText.replace(/^"|"$/g, "");

      if (noteResult.text) {
        noteText = noteText
          ? noteText + " " + noteResult.text
          : noteResult.text;
        i = noteResult.nextIndex;
      }

      testCase.note = noteText.trim();
    }

    // Thêm test case vào worksheet
    worksheetData.push([
      testCase.id,
      testCase.description,
      testCase.procedure,
      testCase.expected,
      testCase.dependence,
      testCase.result,
      "", // Test date
      testCase.note,
    ]);
  }
}

// Tạo worksheet
const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

// Set column widths
worksheet["!cols"] = [
  { wch: 18 }, // ID
  { wch: 50 }, // Test Case Description
  { wch: 70 }, // Test Case Procedure
  { wch: 70 }, // Expected Output
  { wch: 35 }, // Inter-test case Dependence
  { wch: 12 }, // Result
  { wch: 15 }, // Test date
  { wch: 60 }, // Note
];

// Tạo workbook
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Test Cases");

// Ghi file Excel - thử ghi với tên gốc, nếu lỗi thì dùng tên mới
let outputPath = path.join(__dirname, "Test_Case_Report_Auth.xlsx");
try {
  // Xóa file cũ nếu tồn tại (nếu không bị lock)
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }
  XLSX.writeFile(workbook, outputPath);
} catch (err) {
  // Nếu file đang được mở, tạo file với tên mới
  outputPath = path.join(__dirname, "Test_Case_Report_Auth_New.xlsx");
  XLSX.writeFile(workbook, outputPath);
  console.log(
    "⚠️  File gốc đang được mở, đã tạo file mới với tên: Test_Case_Report_Auth_New.xlsx"
  );
}

console.log(`✅ Đã tạo file Excel thành công: ${outputPath}`);
console.log(`📊 Tổng số rows trong worksheet: ${worksheetData.length}`);
