export const PORT = 3000;
export const DATABASE_URL = 'mongodb://localhost:27017/node-api';
export const Collections = {
    USERS: 'users',
    ORDERS: 'orders',
    ITEMS: 'items'
};
export const Roles = {
    ADMIN: 'admin',
    USER: 'user'
};
export const Status = {
    NEW: 'new',
    IN_PROGRESS: 'in progress',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
}
export const SECRET_KEY = "super_mega_secret";