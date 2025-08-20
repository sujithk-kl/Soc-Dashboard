// server/testWindowsEvents.js
const WindowsEventReader = require('./windowsEventReader');

const testWindowsEvents = async () => {
    try {
        console.log('🧪 Testing Windows Event Reader...\n');
        
        const reader = new WindowsEventReader();
        
        // Test 1: Read general security events
        console.log('📊 Test 1: Reading general security events...');
        const generalEvents = await reader.readSecurityEvents(5);
        console.log(`✅ Found ${generalEvents.length} security events\n`);
        
        // Test 2: Read failed logins
        console.log('🔒 Test 2: Reading failed login attempts...');
        const failedLogins = await reader.getFailedLogins(10);
        console.log(`✅ Found ${failedLogins.length} failed login attempts\n`);
        
        // Test 3: Read successful logins
        console.log('✅ Test 3: Reading successful logins...');
        const successfulLogins = await reader.getSuccessfulLogins(10);
        console.log(`✅ Found ${successfulLogins.length} successful logins\n`);
        
        // Test 4: Read new processes
        console.log('🔄 Test 4: Reading new process creation...');
        const newProcesses = await reader.getNewProcesses(10);
        console.log(`✅ Found ${newProcesses.length} new process events\n`);
        
        // Test 5: Start real-time monitoring
        console.log('🖥️  Test 5: Starting real-time monitoring...');
        reader.startMonitoring(5000); // Check every 5 seconds
        
        // Stop monitoring after 15 seconds
        setTimeout(() => {
            reader.stopMonitoring();
            console.log('\n🎉 All tests completed successfully!');
            console.log('🚀 Your SOC Dashboard can now read real Windows Security events!');
            process.exit(0);
        }, 15000);
        
    } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
        process.exit(1);
    }
};

testWindowsEvents();
