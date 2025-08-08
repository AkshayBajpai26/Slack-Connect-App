

  <h1>🚀 Slack Connect App</h1>
  <p>
    A <strong>full-stack application</strong> that allows users to securely connect their Slack workspace, send messages instantly, or schedule them for later — built using <strong>TypeScript, Node.js, React</strong>, and <strong>OAuth 2.0</strong>.
  </p>

  <h2>✨ Features</h2>
  <ul>
    <li>🔐 Secure Slack OAuth 2.0 Authentication</li>
    <li>💬 Instant Message Sending to Slack Channels</li>
    <li>🕓 Schedule Messages with Date-Time Picker</li>
    <li>🗂 Manage Scheduled Messages (View & Cancel)</li>
  </ul>

  <h2>🛠 Tech Stack</h2>
  <table>
    <tr>
      <th>Layer</th>
      <th>Technologies</th>
    </tr>
    <tr>
      <td>Frontend</td>
      <td>React, TypeScript, HTML, CSS</td>
    </tr>
    <tr>
      <td>Backend</td>
      <td>Node.js, Express.js, TypeScript</td>
    </tr>
    <tr>
      <td>Storage</td>
      <td>JSON-based persistence (LowDB-style)</td>
    </tr>
    <tr>
      <td>Auth</td>
      <td>Slack OAuth 2.0 (Access & Refresh Token)</td>
    </tr>
  </table>

  <h2>🧠 Architectural Overview</h2>

  <h3>1. Slack OAuth 2.0 & Token Management</h3>
  <ul>
    <li>Users authenticate via Slack OAuth.</li>
    <li>On successful login, <code>access_token</code> and <code>refresh_token</code> are stored securely in <code>slack_token.json</code>.</li>
    <li>Auto-refresh mechanism renews expired tokens using the refresh token.</li>
  </ul>

  <h3>2. Message Handling</h3>
  <strong>Frontend:</strong>
  <ul>
    <li>Enter message text</li>
    <li>Select Slack channel</li>
    <li>Choose between <strong>Send Now</strong> or <strong>Schedule Later</strong></li>
  </ul>
  <strong>Backend:</strong>
  <ul>
    <li>Real-time message delivery using Slack API</li>
    <li>Scheduling handled via in-memory queue and persistent <code>scheduled.json</code></li>
  </ul>

  <h3>3. Scheduled Message Dispatcher</h3>
  <ul>
    <li>Periodically checks for due messages</li>
    <li>Sends scheduled messages on time</li>
    <li>Users can view and cancel upcoming messages</li>
  </ul>

  <h2>🚀 Getting Started</h2>

  <h3>1. Clone the Repository</h3>
  <pre><code>git clone https://github.com/yourusername/slack-connect-app.git
cd slack-connect-app</code></pre>

  <h3>⚙ Backend Setup</h3>
  <ol>
    <li>Navigate to the backend folder or stay in root</li>
    <li>Install dependencies:
      <pre><code>npm install</code></pre>
    </li>
    <li>Create a <code>.env</code> file:
      <pre><code>CLIENT_ID=your_slack_client_id
CLIENT_SECRET=your_slack_client_secret
REDIRECT_URI=http://localhost:3000/oauth/callback</code></pre>
    </li>
    <li>Start the server:
      <pre><code>npm run dev</code></pre>
    </li>
  </ol>

  <h3>🌐 Frontend Setup</h3>
  <ol>
    <li>Navigate to the frontend folder (if applicable)</li>
    <li>Install frontend packages:
      <pre><code>npm install</code></pre>
    </li>
    <li>Start the dev server:
      <pre><code>npm run dev</code></pre>
    </li>
  </ol>
  <p><strong>App will be live at:</strong> <code>http://localhost:3000</code></p>
  <br></br>
  
  <h2>✅ App Screenshots</h2>

  <h3>🔐 Slack Connected Successfully</h3>
  <img src="https://github.com/user-attachments/assets/ca74008d-14ee-437a-8103-ba5d1a8a1525" alt="OAuth Login Page">
  <p>------------------------------------------------------------------------------------------------------------------------------------------------------------</p>

  
  <h3>💬 Instant Message Interface</h3>
  <img src="https://github.com/user-attachments/assets/0d542251-05df-4464-b860-264d10dbbb28" alt="Instant Message UI">
  <p class="caption">Compose and send a message directly to a selected Slack channel.</p>
  <p>------------------------------------------------------------------------------------------------------------------------------------------------------------</p>


  <h3>🕓 Schedule Message UI</h3>
  <img width="1920" height="1080" alt="Screenshot (29)" src="https://github.com/user-attachments/assets/3eec18ec-18c9-48ca-b3d4-c289eb7a1bd8" />
  <p class="caption">Pick a future date and time to schedule your message.</p>
  <p>------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
  

  <h3>📋 View Scheduled Messages</h3>
  <img src="https://github.com/user-attachments/assets/3d9ce86a-5e8d-4b5a-953e-c68c6f52de54" alt="Scheduled Messages List">
  <p class="caption">List of all upcoming scheduled messages with time and Slack channel.</p>
  <p>------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
  

  <h3>🧾 Slack Channel Message History</h3>
  <img width="1920" height="1080" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/1d81e922-ce1a-476a-b1f5-2c92c945f9a4" />

  <p class="caption">This screenshot shows that the SlackConnectApp was able to send messages to the #social Slack channel.</p>
<p class="caption">Messages were sent right away or planned for later, which showed that the Slack API could handle real-time integration and accurate scheduling. </p>
