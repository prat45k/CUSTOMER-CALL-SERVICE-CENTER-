// =====================================================
// CUSTOMER SERVICE CALL CENTER
// Queue Implemented Using Two Stacks
// =====================================================

// Check login
if (localStorage.getItem('callcenter_loggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Set admin name
var adminName = localStorage.getItem('callcenter_adminName') || 'Admin';
document.getElementById('adminName').textContent = 'Welcome, ' + adminName;

// =====================================================
// STACK CLASS - Simple array-based stack
// =====================================================
function Stack() {
    this.items = [];
}

Stack.prototype.push = function(item) {
    this.items.push(item);
};

Stack.prototype.pop = function() {
    if (this.items.length === 0) {
        return null;
    }
    return this.items.pop();
};

Stack.prototype.peek = function() {
    if (this.items.length === 0) {
        return null;
    }
    return this.items[this.items.length - 1];
};

Stack.prototype.isEmpty = function() {
    return this.items.length === 0;
};

Stack.prototype.size = function() {
    return this.items.length;
};

Stack.prototype.getAll = function() {
    return this.items.slice();
};

// =====================================================
// QUEUE USING TWO STACKS
// =====================================================
function QueueWithTwoStacks() {
    this.stack1 = new Stack();  // Inbox - new calls pushed here
    this.stack2 = new Stack();  // Outbox - calls popped from here
}

// Enqueue: Push item to Stack 1
QueueWithTwoStacks.prototype.enqueue = function(item) {
    this.stack1.push(item);
};

// Transfer: Move all items from Stack 1 to Stack 2
// This reverses the order, so the oldest call is on top of Stack 2
QueueWithTwoStacks.prototype.transferIfNeeded = function() {
    if (this.stack2.isEmpty()) {
        while (!this.stack1.isEmpty()) {
            this.stack2.push(this.stack1.pop());
        }
    }
};

// Dequeue: Pop from Stack 2 (transfer from Stack 1 first if needed)
QueueWithTwoStacks.prototype.dequeue = function() {
    this.transferIfNeeded();
    return this.stack2.pop();
};

// Peek at front of queue
QueueWithTwoStacks.prototype.front = function() {
    this.transferIfNeeded();
    return this.stack2.peek();
};

// Check if queue is empty
QueueWithTwoStacks.prototype.isEmpty = function() {
    return this.stack1.isEmpty() && this.stack2.isEmpty();
};

// Get total size
QueueWithTwoStacks.prototype.size = function() {
    return this.stack1.size() + this.stack2.size();
};

// Get all items in queue order (front to back)
QueueWithTwoStacks.prototype.getAllInOrder = function() {
    // Stack2 items are already in correct order (top = front)
    var result = [];
    var s2 = this.stack2.getAll();
    var s1 = this.stack1.getAll();

    // Stack2: top is front, so reverse the array to get front-first
    for (var i = s2.length - 1; i >= 0; i--) {
        result.push(s2[i]);
    }
    // Stack1: bottom is oldest, so iterate from bottom
    for (var j = 0; j < s1.length; j++) {
        result.push(s1[j]);
    }
    return result;
};

// =====================================================
// GLOBAL STATE
// =====================================================
var callQueue = new QueueWithTwoStacks();
var processedCalls = [];
var totalCallsEver = 0;
var callIdCounter = 1;
var totalWaitTime = 0;  // sum of wait times for processed calls

// =====================================================
// ADD CALL
// =====================================================
function addCall() {
    var nameEl = document.getElementById('callerName');
    var phoneEl = document.getElementById('callerPhone');
    var issueEl = document.getElementById('callerIssue');
    var priorityEl = document.getElementById('callerPriority');

    var name = nameEl.value.trim();
    var phone = phoneEl.value.trim();
    var issue = issueEl.value;
    var priority = priorityEl.value;

    // Validate
    if (name === '') {
        showToast('❌', 'Please enter the caller name!');
        nameEl.focus();
        return;
    }
    if (phone === '') {
        showToast('❌', 'Please enter the phone number!');
        phoneEl.focus();
        return;
    }
    if (phone.length < 7) {
        showToast('❌', 'Phone number seems too short!');
        phoneEl.focus();
        return;
    }

    // Create call object
    var call = {
        id: callIdCounter++,
        name: name,
        phone: phone,
        issue: issue,
        priority: priority,
        addedTime: Date.now()   // timestamp when call was added
    };

    // Enqueue call (push to Stack 1)
    callQueue.enqueue(call);
    totalCallsEver++;

    // Clear form
    nameEl.value = '';
    phoneEl.value = '';
    issueEl.selectedIndex = 0;
    priorityEl.selectedIndex = 0;

    showToast('✅', 'Call #' + call.id + ' from ' + call.name + ' added to queue!');
    updateUI();
}

// =====================================================
// PROCESS CALL
// =====================================================
function processCall() {
    if (callQueue.isEmpty()) {
        showToast('⚠️', 'No calls in the queue to process!');
        return;
    }

    // Show processing modal
    showProcessingModal();

    // After animation, dequeue the call
    setTimeout(function() {
        var call = callQueue.dequeue();

        if (call) {
            // Calculate wait time
            var waitMs = Date.now() - call.addedTime;
            var waitSec = Math.round(waitMs / 1000);
            call.waitDuration = waitSec;
            call.processedTime = Date.now();

            totalWaitTime += waitSec;
            processedCalls.unshift(call);  // add to front so newest first

            hideProcessingModal();
            showToast('✅', 'Call #' + call.id + ' from ' + call.name + ' processed! (Waited ' + formatTime(waitSec) + ')');
            updateUI();
        }
    }, 1800);
}

// =====================================================
// FORMAT TIME
// =====================================================
function formatTime(seconds) {
    if (seconds < 60) {
        return seconds + 's';
    }
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return mins + 'm ' + secs + 's';
}

// =====================================================
// UPDATE ALL UI ELEMENTS
// =====================================================
function updateUI() {
    updateStats();
    updateQueueList();
    updateHistoryList();
    updateStackVisualization();
}

// =====================================================
// UPDATE STATISTICS
// =====================================================
function updateStats() {
    var waiting = callQueue.size();
    var processed = processedCalls.length;

    document.getElementById('statTotal').textContent = totalCallsEver;
    document.getElementById('statWaiting').textContent = waiting;
    document.getElementById('statProcessed').textContent = processed;

    if (processed > 0) {
        var avgWait = Math.round(totalWaitTime / processed);
        document.getElementById('statAvgWait').textContent = formatTime(avgWait);
    } else {
        document.getElementById('statAvgWait').textContent = '0s';
    }

    document.getElementById('queueBadge').textContent = waiting;
    document.getElementById('historyBadge').textContent = processed;
}

// =====================================================
// UPDATE WAITING QUEUE LIST
// =====================================================
function updateQueueList() {
    var container = document.getElementById('queueList');
    var calls = callQueue.getAllInOrder();

    if (calls.length === 0) {
        container.innerHTML = '<div class="empty-state">' +
            '<div class="empty-icon">📭</div>' +
            '<p>No calls waiting</p>' +
            '<p class="empty-sub">Add a new call to get started</p>' +
            '</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < calls.length; i++) {
        var call = calls[i];
        var waitSec = Math.round((Date.now() - call.addedTime) / 1000);
        var avatarClass = call.priority.toLowerCase();
        var priorityEmoji = call.priority === 'Urgent' ? '🔴' : (call.priority === 'High' ? '🟡' : '🟢');

        html += '<div class="call-card">' +
            '<div class="call-avatar ' + avatarClass + '">' + priorityEmoji + '</div>' +
            '<div class="call-details">' +
                '<div class="call-name">' + escapeHtml(call.name) +
                    ' <span class="priority-tag ' + call.priority + '">' + call.priority + '</span>' +
                '</div>' +
                '<div class="call-phone">📱 ' + escapeHtml(call.phone) + '</div>' +
                '<div class="call-issue">💬 ' + escapeHtml(call.issue) + '</div>' +
                '<div class="call-position">Position in queue: #' + (i + 1) + '</div>' +
            '</div>' +
            '<div class="call-time-info">' +
                '<div class="call-wait-time" data-added="' + call.addedTime + '">' + formatTime(waitSec) + '</div>' +
                '<div class="call-wait-label">waiting</div>' +
            '</div>' +
        '</div>';
    }

    container.innerHTML = html;
}

// =====================================================
// UPDATE PROCESSED HISTORY LIST
// =====================================================
function updateHistoryList() {
    var container = document.getElementById('historyList');

    if (processedCalls.length === 0) {
        container.innerHTML = '<div class="empty-state">' +
            '<div class="empty-icon">📋</div>' +
            '<p>No calls processed yet</p>' +
            '<p class="empty-sub">Process calls from the queue</p>' +
            '</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < processedCalls.length; i++) {
        var call = processedCalls[i];
        html += '<div class="history-card">' +
            '<div class="history-avatar">✅</div>' +
            '<div class="history-details">' +
                '<div class="history-name">' + escapeHtml(call.name) + ' (#' + call.id + ')</div>' +
                '<div class="history-meta">📱 ' + escapeHtml(call.phone) + ' • ' + escapeHtml(call.issue) + '</div>' +
            '</div>' +
            '<div class="history-waited">Waited: ' + formatTime(call.waitDuration) + '</div>' +
        '</div>';
    }

    container.innerHTML = html;
}

// =====================================================
// UPDATE STACK VISUALIZATION
// =====================================================
function updateStackVisualization() {
    var s1Container = document.getElementById('stack1Visual');
    var s2Container = document.getElementById('stack2Visual');

    var s1Items = callQueue.stack1.getAll();
    var s2Items = callQueue.stack2.getAll();

    // Stack 1
    if (s1Items.length === 0) {
        s1Container.innerHTML = '<div class="empty-stack">Empty</div>';
    } else {
        var html1 = '';
        for (var i = 0; i < s1Items.length; i++) {
            html1 += '<div class="stack-item">#' + s1Items[i].id + ' ' + escapeHtml(s1Items[i].name) + '</div>';
        }
        s1Container.innerHTML = html1;
    }

    // Stack 2
    if (s2Items.length === 0) {
        s2Container.innerHTML = '<div class="empty-stack">Empty</div>';
    } else {
        var html2 = '';
        for (var j = 0; j < s2Items.length; j++) {
            html2 += '<div class="stack-item">#' + s2Items[j].id + ' ' + escapeHtml(s2Items[j].name) + '</div>';
        }
        s2Container.innerHTML = html2;
    }
}

// =====================================================
// TOAST NOTIFICATION
// =====================================================
function showToast(icon, text) {
    var toast = document.getElementById('toast');
    document.getElementById('toastIcon').textContent = icon;
    document.getElementById('toastText').textContent = text;
    toast.classList.add('show');

    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// =====================================================
// PROCESSING MODAL
// =====================================================
function showProcessingModal() {
    var modal = document.getElementById('processModal');
    var progressBar = document.getElementById('progressBar');

    modal.classList.add('show');
    progressBar.style.width = '0%';

    // Animate progress bar
    setTimeout(function() { progressBar.style.width = '30%'; }, 200);
    setTimeout(function() {
        document.getElementById('modalMessage').textContent = 'Dequeuing from Stack 2...';
        progressBar.style.width = '70%';
    }, 800);
    setTimeout(function() {
        document.getElementById('modalMessage').textContent = 'Call processed successfully!';
        progressBar.style.width = '100%';
    }, 1400);
}

function hideProcessingModal() {
    var modal = document.getElementById('processModal');
    modal.classList.remove('show');
    // Reset text for next time
    document.getElementById('modalTitle').textContent = 'Processing Call...';
    document.getElementById('modalMessage').textContent = 'Transferring from Stack 1 to Stack 2...';
}

// =====================================================
// ESCAPE HTML (prevent XSS)
// =====================================================
function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

// =====================================================
// LOGOUT
// =====================================================
function handleLogout() {
    localStorage.removeItem('callcenter_loggedIn');
    localStorage.removeItem('callcenter_adminName');
    window.location.href = 'login.html';
}

// =====================================================
// LIVE TIMER UPDATE - updates waiting times every second
// =====================================================
setInterval(function() {
    var timeElements = document.querySelectorAll('.call-wait-time[data-added]');
    for (var i = 0; i < timeElements.length; i++) {
        var addedTime = parseInt(timeElements[i].getAttribute('data-added'));
        var waitSec = Math.round((Date.now() - addedTime) / 1000);
        timeElements[i].textContent = formatTime(waitSec);
    }
}, 1000);

// =====================================================
// INITIALIZE
// =====================================================
updateUI();
