
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const cron = require('node-cron');
const recurringService = require('./services/recurringService');

// Notification system imports
const BudgetFacade = require('./services/budgetFacade');
const NotificationManager = require('./services/notification/notificationManager');
const WebSocketAdapter = require('./services/notification/adapters/websocketAdapter');
const { WebSocketStrategy } = require('./services/notification/strategy');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/catRoutes'));
app.use('/api/transactions', require('./routes/transRoute'));

// Export the app object for testing
if (require.main === module) {
  connectDB();

  // recurring transaction processing every day (cron job)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily recurring trs job...');
    await recurringService.processRecurringTransactions();
  });

  const PORT = process.env.PORT || 5001;
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000', // TODO adjust in production
      methods: ['GET', 'POST'],
    },
  });

  // web socket mapping (notifications system)
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room by user id 
    socket.on('registerUser', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // Notification managers (Observer + Strategy + Adapter)
  const wsManager = new NotificationManager(new WebSocketStrategy(new WebSocketAdapter(io)));
  const budgetSubject = BudgetFacade.getSubject();
  budgetSubject.subscribe(wsManager);

  // const emailManager = new NotificationManager(new EmailStrategy(new EmailAdapter()));
  // budgetSubject.subscribe(emailManager);
  // budgetSubject.subscribe(emailManager);


  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}


module.exports = app
