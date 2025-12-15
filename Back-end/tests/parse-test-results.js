#!/usr/bin/env node

/**
 * Script để parse và hiển thị test results từ Jest JSON output
 * Usage: node parse-test-results.js [path-to-test-results.json]
 */

const fs = require('fs');
const path = require('path');

// Get file path from command line or use default
const filePath = process.argv[2] || path.join(__dirname, '../../test-results.json');

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log('\n📊 TEST RESULTS SUMMARY\n');
  console.log('═'.repeat(60));
  console.log(`Total Tests:     ${data.numTotalTests}`);
  console.log(`✅ Passed:       ${data.numPassedTests}`);
  console.log(`❌ Failed:       ${data.numFailedTests}`);
  console.log(`⏸️  Pending:      ${data.numPendingTests}`);
  console.log('═'.repeat(60));

  if (data.numFailedTests > 0 && data.testResults && data.testResults.length > 0) {
    console.log('\n❌ FAILED TESTS:\n');
    console.log('─'.repeat(60));

    data.testResults.forEach((suite) => {
      if (suite.assertionResults) {
        suite.assertionResults.forEach((test) => {
          if (test.status === 'failed') {
            console.log(`\n🔴 ${test.fullName}`);
            console.log(`   Duration: ${test.duration}ms`);
            
            if (test.failureMessages && test.failureMessages.length > 0) {
              // Extract first error message
              const firstError = test.failureMessages[0];
              const errorLines = firstError.split('\n');
              
              // Find the main error message
              const errorMatch = firstError.match(/Expected: (.+?)\n/);
              const receivedMatch = firstError.match(/Received: (.+?)\n/);
              
              if (errorMatch) {
                console.log(`   Expected: ${errorMatch[1].trim()}`);
              }
              if (receivedMatch) {
                console.log(`   Received: ${receivedMatch[1].trim()}`);
              }
              
              // Show error type
              if (firstError.includes('TypeError')) {
                console.log(`   Error: TypeError`);
              } else if (firstError.includes('expect')) {
                console.log(`   Error: Assertion failed`);
              }
              
              // Show file location if available
              const locationMatch = firstError.match(/\((.+?):(\d+):(\d+)\)/);
              if (locationMatch) {
                const relativePath = locationMatch[1].split('/').slice(-2).join('/');
                console.log(`   Location: ${relativePath}:${locationMatch[2]}`);
              }
            }
          }
        });
      }
    });

    console.log('\n' + '─'.repeat(60));
  }

  if (data.numPassedTests > 0 && data.testResults && data.testResults.length > 0) {
    console.log('\n✅ PASSED TESTS:\n');
    console.log('─'.repeat(60));

    data.testResults.forEach((suite) => {
      if (suite.assertionResults) {
        suite.assertionResults.forEach((test) => {
          if (test.status === 'passed') {
            console.log(`✅ ${test.fullName} (${test.duration}ms)`);
          }
        });
      }
    });

    console.log('─'.repeat(60));
  }

  // Summary by category
  if (data.testResults && data.testResults.length > 0) {
    console.log('\n📋 SUMMARY BY CATEGORY:\n');
    
    const categories = {};
    data.testResults.forEach((suite) => {
      if (suite.assertionResults) {
        suite.assertionResults.forEach((test) => {
          const category = test.ancestorTitles[0] || 'Other';
          if (!categories[category]) {
            categories[category] = { passed: 0, failed: 0 };
          }
          if (test.status === 'passed') {
            categories[category].passed++;
          } else if (test.status === 'failed') {
            categories[category].failed++;
          }
        });
      }
    });

    Object.entries(categories).forEach(([category, counts]) => {
      const total = counts.passed + counts.failed;
      const passRate = total > 0 ? ((counts.passed / total) * 100).toFixed(1) : 0;
      console.log(`${category}:`);
      console.log(`  Total: ${total} | ✅ ${counts.passed} | ❌ ${counts.failed} | Pass Rate: ${passRate}%`);
    });
  }

  console.log('\n');
} catch (error) {
  console.error('❌ Error parsing JSON:', error.message);
  process.exit(1);
}

