import express from "express";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import cors from 'cors';


import category_suppliesRoutes from './routes/suppliescategory.routes.js';
import category_productsRoutes from './routes/productcategory.routes.js'
import suppliesRoutes from '../src/routes/supplies.routes.js';
import roleRoutes from './routes/role.routes.js';
import userRoutes from './routes/user.routes.js';
import supplierRoutes from './routes/supplier.routes.js'
import shoppingRoutes from './routes/shopping.routes.js'
import shoppingdetailRoute from './routes/shopping.routes.js'
import RoutesSale from './routes/sale.routes.js';
import RoutesSaleDetail from './routes/saledetail.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();

const corsOptions = {
    origin: 'https://final-demeter-production.up.railway.app', // Ajusta esto según tus necesidades
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Habilitar el intercambio de cookies (si es necesario)
    optionsSuccessStatus: 204,
  }; 

app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());

app.use(cookieParser());

app.use(supplierRoutes)
app.use(shoppingRoutes)
app.use(shoppingdetailRoute)
app.use(category_suppliesRoutes);
app.use(category_productsRoutes);
app.use(suppliesRoutes);
app.use(roleRoutes);
app.use(userRoutes);
app.use(RoutesSale);
app.use(RoutesSaleDetail);
app.use(RoutesSale);
app.use(RoutesSaleDetail);
app.use(dashboardRoutes);
app.use(productRoutes);

export default app;
