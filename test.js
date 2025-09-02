// Test script for Moses's Personal Profile Website
const fs = require('fs');

console.log('🧪 Testing Moses\'s Personal Profile Website...\n');

// Test 1: Check if main page exists
function testIndexExists() {
    if (fs.existsSync('index.html')) {
        console.log('✅ Test 1 PASSED: index.html exists');
        return true;
    } else {
        console.log('❌ Test 1 FAILED: index.html not found');
        return false;
    }
}

// Test 2: Check if HTML has required content for personal profile
function testContent() {
    const content = fs.readFileSync('index.html', 'utf8');

    const checks = [
        { name: 'Title tag', text: '<title>' },
        { name: 'Moses Omondi name', text: 'Moses Omondi' },
        { name: 'Things I Love section', text: 'Things I Love' },
        { name: 'HTML structure', text: '<!DOCTYPE html>' }
    ];

    let allPassed = true;

    checks.forEach((check, index) => {
        if (content.includes(check.text)) {
            console.log(`✅ Test 2.${index + 1} PASSED: Contains ${check.name}`);
        } else {
            console.log(`❌ Test 2.${index + 1} FAILED: Missing ${check.name}`);
            allPassed = false;
        }
    });

    return allPassed;
}

// Test 3: Check file size (should be reasonable)
function testFileSize() {
    const stats = fs.statSync('index.html');
    const sizeKB = stats.size / 1024;

    if (sizeKB > 0.5 && sizeKB < 50) {
        console.log(`✅ Test 3 PASSED: File size is ${sizeKB.toFixed(1)}KB (reasonable)`);
        return true;
    } else {
        console.log(`❌ Test 3 FAILED: File size is ${sizeKB.toFixed(1)}KB (too big or too small)`);
        return false;
    }
}

// Run all tests
console.log('Running all tests...\n');

const test1 = testIndexExists();
const test2 = testContent();
const test3 = testFileSize();

console.log('\n📊 FINAL RESULTS:');
console.log('==================');

if (test1 && test2 && test3) {
    console.log('🎉 ALL TESTS PASSED! Personal profile is ready for deployment!');
    process.exit(0);  // Success exit code
} else {
    console.log('💥 SOME TESTS FAILED! Fix the issues before deploying.');
    process.exit(1);  // Error exit code (stops deployment)
}
