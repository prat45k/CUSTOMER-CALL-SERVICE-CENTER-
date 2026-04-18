Customer Call Service Center

A beginner-friendly Customer Call Service Center simulation project. This system demonstrates the practical application of a **Queue** data structure, implemented using **Two Stacks**, to manage customer service phone calls. By default, queues operate on a "First-In, First-Out" (FIFO) principle, much like a real-life waiting line.

The project features a **C++ backend** for core logic processing and an interactive, visually appealing **frontend built with HTML, CSS, and vanilla JavaScript**.


 Features

- Queue using Two Stacks:** Core data structure logic uses a two-stack queue to ensure reliable FIFO operations.
- Call Management:** Add calls with customer names, phone numbers, reasons for calling, and priority levels (Normal, High, Urgent).
- Process Next Call:** Handle incoming calls in correct queue order and visualize the queue transfer between the two simulated stacks.
- Interactive Dashboard:** Beautiful, modern, dark-themed frontend UI with smooth micro-animations.
- Real-Time Analytics:** Track daily total calls, waiting queue count, and average waiting time dynamically.
- Admin Authentication:** Secure login website portal designed to restrict dashboard access to authorized administrators.

 Project Structure

- `callcenter.cpp`**: The core C++ backend program that models the call center logic via the command line.
- `login.html`**: The secure admin login gateway to access the system dashboard.
- `dashboard.html`**: The main graphical user interface for visualizing the call center.
- `dashboard.css`**: Styling elements providing a premium, modern dark-themed UX.
- `dashboard.js`**: Frontend logic, interactive elements, queue visualization logic, and timer handling.

 How to Run
 Frontend Simulator (Web Interface)
1. Open the project directory on your local machine.
2. Double-click on `login.html` to open it in your default web browser.
3. Log in using default credentials (e.g., username: `admin` / password: `admin`), or register a new account.
4. Interact with the dashboard to add customers to the queue and process existing calls!

 Backend Simulator (Command Line)
1. Ensure you have a C++ compiler installed (like GCC/MinGW or MSVC).
2. Open a terminal or command prompt in the project directory.
3. Compile the C++ program: 
   ```bash
   g++ callcenter.cpp -o callcenter
   ```
4. Run the newly compiled executable:
   - **Windows:** `callcenter.exe`
   - **Linux/Mac:** `./callcenter`

 Technologies Used

- **Frontend:** HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+)
- **Backend:** C++ Standard Template Library (STL)

---
 How It Works (The Two-Stack Queue)

A mathematical **Queue** naturally follows FIFO (First-In, First-Out) ordering (e.g., the first person to call is the first person to be answered). But what if you only have **Stacks**, which follow LIFO (Last-In, First-Out)? 

We can recreate a Queue using two stacks (Stack 1 acting as the "Inbox", Stack 2 as the "Outbox"):
1. **Adding a Call (Enqueue):** Push new incoming calls onto Stack 1.
2. **Processing a Call (Dequeue):** 
   - If Stack 2 is empty, we pop all elements off Stack 1 and push them onto Stack 2. This completely reverses the order, putting the oldest call perfectly at the top of Stack 2.
   - We then easily pop the top call off Stack 2 to process and drop the oldest caller.
