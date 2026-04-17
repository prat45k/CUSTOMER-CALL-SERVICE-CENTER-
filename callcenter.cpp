#include <iostream>
#include <string>
#include <ctime>
using namespace std;

const int MAX_SIZE = 100;

struct Call {
    int id;
    string callerName;
    string phoneNumber;
    string issue;
    string priority;
    time_t addedTime;      
    time_t processedTime;  
    int waitDuration;      
};

class Stack {
private:
    Call items[MAX_SIZE];
    int topIndex;

public:

    Stack() {
        topIndex = -1;
    }

    void push(Call item) {
        if (topIndex >= MAX_SIZE - 1) {
            cout << "Stack is full! Cannot add more calls." << endl;
            return;
        }
        topIndex++;
        items[topIndex] = item;
    }

    Call pop() {
        Call emptyCall;
        emptyCall.id = -1;  // indicates invalid

        if (topIndex < 0) {
            cout << "Stack is empty!" << endl;
            return emptyCall;
        }

        Call topItem = items[topIndex];
        topIndex--;
        return topItem;
    }

    Call peek() {
        Call emptyCall;
        emptyCall.id = -1;

        if (topIndex < 0) {
            return emptyCall;
        }
        return items[topIndex];
    }

    bool isEmpty() {
        return topIndex < 0;
    }

    int size() {
        return topIndex + 1;
    }


    Call getAt(int index) {
        return items[index];
    }
};

class QueueWithTwoStacks {
private:
    Stack stack1;  
    Stack stack2;  

    void transferIfNeeded() {
        if (stack2.isEmpty()) {
            while (!stack1.isEmpty()) {
                stack2.push(stack1.pop());
            }
        }
    }

public:
   
    void enqueue(Call item) {
        stack1.push(item);
        cout << ">> Call #" << item.id << " from " << item.callerName
             << " added to queue (pushed to Stack 1)" << endl;
    }

    Call dequeue() {
        transferIfNeeded();

        if (stack2.isEmpty()) {
            cout << "Queue is empty! No calls to process." << endl;
            Call emptyCall;
            emptyCall.id = -1;
            return emptyCall;
        }

        Call frontCall = stack2.pop();
        return frontCall;
    }

    Call front() {
        transferIfNeeded();
        return stack2.peek();
    }

    
    bool isEmpty() {
        return stack1.isEmpty() && stack2.isEmpty();
    }

    
    int size() {
        return stack1.size() + stack2.size();
    }

    void displayQueue() {
        if (isEmpty()) {
            cout << "  No calls are waiting in the queue." << endl;
            return;
        }



        int position = 1;

        // Stack2 items: top is front of queue
        for (int i = stack2.size() - 1; i >= 0; i--) {
            Call c = stack2.getAt(i);
            time_t now = time(0);
            int waitSecs = (int)(now - c.addedTime);

            cout << "  #" << position << " | ID:" << c.id
                 << " | " << c.callerName
                 << " | Phone: " << c.phoneNumber
                 << " | Issue: " << c.issue
                 << " | Priority: " << c.priority
                 << " | Waiting: " << waitSecs << "s" << endl;
            position++;
        }

        // Stack1 items: bottom is next in queue
        for (int i = 0; i < stack1.size(); i++) {
            Call c = stack1.getAt(i);
            time_t now = time(0);
            int waitSecs = (int)(now - c.addedTime);

            cout << "  #" << position << " | ID:" << c.id
                 << " | " << c.callerName
                 << " | Phone: " << c.phoneNumber
                 << " | Issue: " << c.issue
                 << " | Priority: " << c.priority
                 << " | Waiting: " << waitSecs << "s" << endl;
            position++;
        }
    }

    // Get stack sizes for display
    int getStack1Size() { return stack1.size(); }
    int getStack2Size() { return stack2.size(); }
};

// =====================================================
// DISPLAY HELPER FUNCTIONS
// =====================================================
void printSeparator() {
    cout << "=============================================" << endl;
}

void printHeader(string title) {
    cout << endl;
    printSeparator();
    cout << "  " << title << endl;
    printSeparator();
}

void clearScreen() {
    // Works on Windows
    #ifdef _WIN32
        system("cls");
    #else
        system("clear");
    #endif
}

// =====================================================
// MAIN PROGRAM
// =====================================================
int main() {
    QueueWithTwoStacks callQueue;
    Call processedCalls[MAX_SIZE];
    int processedCount = 0;
    int totalCalls = 0;
    int callIdCounter = 1;
    int totalWaitTime = 0;

    int choice;

    cout << endl;
    printSeparator();
    cout << "  CUSTOMER SERVICE CALL CENTER" << endl;
    cout << "  Queue Implementation Using Two Stacks" << endl;
    printSeparator();
    cout << endl;

    // Main menu loop
    while (true) {
        cout << endl;
        cout << "========== MAIN MENU ==========" << endl;
        cout << "  1. Add New Call" << endl;
        cout << "  2. Process Next Call" << endl;
        cout << "  3. Show Waiting Calls" << endl;
        cout << "  4. Show Statistics" << endl;
        cout << "  5. View Call History" << endl;
        cout << "  6. Exit" << endl;
        cout << "================================" << endl;
        cout << "  Enter your choice (1-6): ";
        cin >> choice;

        // Clear input buffer
        cin.ignore(10000, '\n');

        switch (choice) {

        // ----- ADD NEW CALL -----
        case 1: {
            printHeader("ADD NEW CALL");

            Call newCall;
            newCall.id = callIdCounter++;

            cout << "  Enter Caller Name: ";
            getline(cin, newCall.callerName);

            cout << "  Enter Phone Number: ";
            getline(cin, newCall.phoneNumber);

            cout << "  Select Issue Type:" << endl;
            cout << "    1. Billing Issue" << endl;
            cout << "    2. Technical Support" << endl;
            cout << "    3. Account Query" << endl;
            cout << "    4. Complaint" << endl;
            cout << "    5. General Inquiry" << endl;
            cout << "  Enter choice (1-5): ";

            int issueChoice;
            cin >> issueChoice;
            cin.ignore(10000, '\n');

            switch (issueChoice) {
                case 1: newCall.issue = "Billing Issue"; break;
                case 2: newCall.issue = "Technical Support"; break;
                case 3: newCall.issue = "Account Query"; break;
                case 4: newCall.issue = "Complaint"; break;
                default: newCall.issue = "General Inquiry"; break;
            }

            cout << "  Select Priority:" << endl;
            cout << "    1. Normal" << endl;
            cout << "    2. High" << endl;
            cout << "    3. Urgent" << endl;
            cout << "  Enter choice (1-3): ";

            int prioChoice;
            cin >> prioChoice;
            cin.ignore(10000, '\n');

            switch (prioChoice) {
                case 2: newCall.priority = "High"; break;
                case 3: newCall.priority = "Urgent"; break;
                default: newCall.priority = "Normal"; break;
            }

            newCall.addedTime = time(0);  // current time
            newCall.waitDuration = 0;

            // Enqueue the call
            callQueue.enqueue(newCall);
            totalCalls++;

            cout << endl;
            cout << "  Call successfully added to queue!" << endl;
            cout << "  Queue size: " << callQueue.size() << " calls waiting" << endl;
            cout << "  [Stack 1 size: " << callQueue.getStack1Size() 
                 << " | Stack 2 size: " << callQueue.getStack2Size() << "]" << endl;
            break;
        }

        // ----- PROCESS NEXT CALL -----
        case 2: {
            printHeader("PROCESS NEXT CALL");

            if (callQueue.isEmpty()) {
                cout << "  No calls in the queue to process!" << endl;
                cout << "  Add some calls first." << endl;
                break;
            }

            cout << "  Transferring calls if needed..." << endl;
            cout << "  [Stack 1 -> Stack 2 transfer happening]" << endl;
            cout << endl;

            Call processed = callQueue.dequeue();

            if (processed.id != -1) {
                processed.processedTime = time(0);
                processed.waitDuration = (int)(processed.processedTime - processed.addedTime);
                totalWaitTime += processed.waitDuration;

                // Save to history
                processedCalls[processedCount] = processed;
                processedCount++;

                cout << "  CALL PROCESSED SUCCESSFULLY!" << endl;
                cout << "  -------------------------" << endl;
                cout << "  Call ID    : " << processed.id << endl;
                cout << "  Caller     : " << processed.callerName << endl;
                cout << "  Phone      : " << processed.phoneNumber << endl;
                cout << "  Issue      : " << processed.issue << endl;
                cout << "  Priority   : " << processed.priority << endl;
                cout << "  Wait Time  : " << processed.waitDuration << " seconds" << endl;
                cout << "  -------------------------" << endl;
                cout << "  Remaining in queue: " << callQueue.size() << endl;
            }
            break;
        }

        // ----- SHOW WAITING CALLS -----
        case 3: {
            printHeader("WAITING CALLS IN QUEUE");

            cout << "  Total waiting: " << callQueue.size() << " calls" << endl;
            cout << "  [Stack 1: " << callQueue.getStack1Size() 
                 << " | Stack 2: " << callQueue.getStack2Size() << "]" << endl;
            cout << endl;

            callQueue.displayQueue();
            break;
        }

        // ----- SHOW STATISTICS -----
        case 4: {
            printHeader("CALL CENTER STATISTICS");

            cout << "  Total Calls Received  : " << totalCalls << endl;
            cout << "  Calls Processed       : " << processedCount << endl;
            cout << "  Calls Waiting         : " << callQueue.size() << endl;
            cout << "  Stack 1 Size (Inbox)  : " << callQueue.getStack1Size() << endl;
            cout << "  Stack 2 Size (Outbox) : " << callQueue.getStack2Size() << endl;

            if (processedCount > 0) {
                int avgWait = totalWaitTime / processedCount;
                cout << "  Total Wait Time       : " << totalWaitTime << " seconds" << endl;
                cout << "  Average Wait Time     : " << avgWait << " seconds" << endl;
            } else {
                cout << "  Average Wait Time     : N/A (no calls processed yet)" << endl;
            }
            break;
        }

        // ----- VIEW CALL HISTORY -----
        case 5: {
            printHeader("PROCESSED CALL HISTORY");

            if (processedCount == 0) {
                cout << "  No calls have been processed yet." << endl;
                break;
            }

            for (int i = processedCount - 1; i >= 0; i--) {
                Call c = processedCalls[i];
                cout << "  Call #" << c.id
                     << " | " << c.callerName
                     << " | " << c.phoneNumber
                     << " | " << c.issue
                     << " | Priority: " << c.priority
                     << " | Waited: " << c.waitDuration << "s" << endl;
            }

            cout << endl;
            cout << "  Total processed: " << processedCount << " calls" << endl;
            break;
        }

        // ----- EXIT -----
        case 6: {
            printHeader("THANK YOU!");
            cout << "  Exiting Call Center System..." << endl;
            cout << "  Total calls handled: " << totalCalls << endl;
            cout << "  Goodbye!" << endl;
            cout << endl;
            return 0;
        }

        default:
            cout << "  Invalid choice! Please enter 1-6." << endl;
            break;
        }
    }

    return 0;
}
