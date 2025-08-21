// server/checkSystemEvents.js
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function checkSystemEvents() {
    console.log('🔍 Checking Windows System Events...\n');

    try {
        // Check Security Events
        console.log('📋 Security Events (Last 5):');
        const securityEvents = await execAsync('powershell -Command "Get-WinEvent -LogName Security -MaxEvents 5 | Select-Object TimeCreated, Id, Message | Format-Table -AutoSize"');
        console.log(securityEvents.stdout);

        // Check Defender Events
        console.log('🛡️ Windows Defender Events (Last 5):');
        const defenderEvents = await execAsync('powershell -Command "Get-WinEvent -LogName \'Microsoft-Windows-Windows Defender/Operational\' -MaxEvents 5 | Select-Object TimeCreated, Id, Message | Format-Table -AutoSize"');
        console.log(defenderEvents.stdout);

        // Check Failed Logins
        console.log('❌ Failed Login Attempts (Last 3):');
        const failedLogins = await execAsync('powershell -Command "Get-WinEvent -FilterHashtable @{LogName=\'Security\'; Id=4625} -MaxEvents 3 | Select-Object TimeCreated, Id, Message | Format-Table -AutoSize"');
        console.log(failedLogins.stdout);

    } catch (error) {
        console.error('Error checking events:', error.message);
    }
}

checkSystemEvents();
