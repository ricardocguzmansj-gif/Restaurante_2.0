import { MenuCategory, MenuItem, Customer, Order, Coupon, User, UserRole, OrderStatus, OrderType, RestaurantSettings, Table, TableStatus, Ingredient, IngredientCategory, OrderItem } from '../types';

export const demoRestaurantId = 'rest-pizarra-01';

// --- USUARIOS ---
export const demoUsers: User[] = [
  { id: 'user-admin-1', restaurant_id: demoRestaurantId, nombre: 'Admin Pizarra', email: 'admin@pizarra.es', rol: UserRole.ADMIN, avatar_url: `https://i.pravatar.cc/150?u=admin`, password: 'password' },
  { id: 'user-gerente-1', restaurant_id: demoRestaurantId, nombre: 'Gerente Pizarra', email: 'gerente@pizarra.es', rol: UserRole.GERENTE, avatar_url: `https://i.pravatar.cc/150?u=gerente`, password: 'password' },
  { id: 'user-mozo-1', restaurant_id: demoRestaurantId, nombre: 'Mozo Pizarra', email: 'mozo@pizarra.es', rol: UserRole.MOZO, avatar_url: `https://i.pravatar.cc/150?u=mozo`, password: 'password' },
  { id: 'user-cocina-1', restaurant_id: demoRestaurantId, nombre: 'Cocinero Pizarra', email: 'cocina@pizarra.es', rol: UserRole.COCINA, avatar_url: `https://i.pravatar.cc/150?u=cocina`, password: 'password' },
  { id: 'user-reparto-1', restaurant_id: demoRestaurantId, nombre: 'Repartidor Pizarra', email: 'reparto@pizarra.es', rol: UserRole.REPARTO, avatar_url: `https://i.pravatar.cc/150?u=reparto`, estado_delivery: 'DISPONIBLE', password: 'password' },
  { id: 'user-mozo-2', restaurant_id: demoRestaurantId, nombre: 'Mozo Descartable', email: 'mozo2@pizarra.es', rol: UserRole.MOZO, avatar_url: `https://i.pravatar.cc/150?u=mozo2`, password: 'password' },
];


// --- INVENTARIO ---
export const demoIngredients: Ingredient[] = [
    { id: 'ing-1', restaurant_id: demoRestaurantId, nombre: 'Harina 0000', unidad: 'gr', stock_actual: 50000, stock_minimo: 5000, coste_unitario: 0.05, categoria: IngredientCategory.GENERAL },
    { id: 'ing-2', restaurant_id: demoRestaurantId, nombre: 'Salsa de Tomate', unidad: 'ml', stock_actual: 20000, stock_minimo: 2000, coste_unitario: 0.1, categoria: IngredientCategory.GENERAL },
    { id: 'ing-3', restaurant_id: demoRestaurantId, nombre: 'Queso Muzzarella', unidad: 'gr', stock_actual: 30000, stock_minimo: 3000, coste_unitario: 0.3, categoria: IngredientCategory.GENERAL },
    { id: 'ing-4', restaurant_id: demoRestaurantId, nombre: 'Jamón Cocido', unidad: 'gr', stock_actual: 10000, stock_minimo: 1000, coste_unitario: 0.4, categoria: IngredientCategory.GENERAL },
    { id: 'ing-5', restaurant_id: demoRestaurantId, nombre: 'Carne Picada', unidad: 'gr', stock_actual: 15000, stock_minimo: 2000, coste_unitario: 0.5, categoria: IngredientCategory.GENERAL },
    { id: 'ing-6', restaurant_id: demoRestaurantId, nombre: 'Agua Mineral', unidad: 'ml', stock_actual: 50000, stock_minimo: 10000, coste_unitario: 0.02, categoria: IngredientCategory.BEBIDA },
    { id: 'ing-7', restaurant_id: demoRestaurantId, nombre: 'Gaseosa Cola', unidad: 'ml', stock_actual: 60000, stock_minimo: 12000, coste_unitario: 0.04, categoria: IngredientCategory.BEBIDA },
    { id: 'ing-8', restaurant_id: demoRestaurantId, nombre: 'Cerveza Lager', unidad: 'ml', stock_actual: 40000, stock_minimo: 8000, coste_unitario: 0.08, categoria: IngredientCategory.BEBIDA },
];


// --- CATEGORÍAS Y MENÚ ---
export const demoCategories: MenuCategory[] = [
    { id: 'cat-1', restaurant_id: demoRestaurantId, nombre: 'Pizzas', orden: 1 },
    { id: 'cat-2', restaurant_id: demoRestaurantId, nombre: 'Bebidas', orden: 2 },
    { id: 'cat-3', restaurant_id: demoRestaurantId, nombre: 'Postres', orden: 3 },
];

export const demoMenuItems: Omit<MenuItem, 'coste' | 'stock_actual'>[] = [
    { id: 'item-1', restaurant_id: demoRestaurantId, category_id: 'cat-1', nombre: 'Pizza Muzzarella', descripcion: 'Clásica pizza de muzzarella con salsa de tomate casera y aceitunas.', precio_base: 850, receta: [{ingredient_id: 'ing-1', cantidad: 300}, {ingredient_id: 'ing-2', cantidad: 150}, {ingredient_id: 'ing-3', cantidad: 250}], img_url: 'https://i.imgur.com/gC27m8d.jpeg', etiquetas: ['vegetariano', 'clásico'], disponible: true, tiempo_preparacion_min: 15, permite_venta_sin_stock: false },
    { id: 'item-2', restaurant_id: demoRestaurantId, category_id: 'cat-1', nombre: 'Pizza Jamón y Morrones', descripcion: 'Muzzarella, jamón cocido de primera calidad y morrones asados.', precio_base: 980, receta: [{ingredient_id: 'ing-1', cantidad: 300}, {ingredient_id: 'ing-2', cantidad: 150}, {ingredient_id: 'ing-3', cantidad: 200}, {ingredient_id: 'ing-4', cantidad: 100}], img_url: 'https://i.imgur.com/xHdei8a.jpeg', etiquetas: [], disponible: true, tiempo_preparacion_min: 18, permite_venta_sin_stock: false },
    { id: 'item-3', restaurant_id: demoRestaurantId, category_id: 'cat-2', nombre: 'Gaseosa Cola 500ml', descripcion: 'Botella de gaseosa sabor cola de 500ml.', precio_base: 250, receta: [{ingredient_id: 'ing-7', cantidad: 500}], img_url: 'https://i.imgur.com/J3a2aSc.jpeg', etiquetas: [], disponible: true, tiempo_preparacion_min: 1, permite_venta_sin_stock: true },
    { id: 'item-4', restaurant_id: demoRestaurantId, category_id: 'cat-2', nombre: 'Cerveza Lager 1L', descripcion: 'Botella de cerveza rubia de 1 litro.', precio_base: 600, receta: [{ingredient_id: 'ing-8', cantidad: 1000}], img_url: 'https://i.imgur.com/YwUnACN.jpeg', etiquetas: ['alcohol'], disponible: true, tiempo_preparacion_min: 1, permite_venta_sin_stock: true },
    { id: 'item-5', restaurant_id: demoRestaurantId, category_id: 'cat-3', nombre: 'Flan Casero', descripcion: 'Flan casero con dulce de leche y crema.', precio_base: 450, receta: [], img_url: 'https://i.imgur.com/N6aT7fF.jpeg', etiquetas: [], disponible: true, tiempo_preparacion_min: 5, permite_venta_sin_stock: true },
];

// --- DATOS TRANSACCIONALES DE DEMOSTRACIÓN ---
export const demoCustomers: Customer[] = [
    { id: 'cust-1', restaurant_id: demoRestaurantId, nombre: 'Juan Pérez', telefono: '1123456789', email: 'juan.perez@example.com', ltv: 5600, ultima_compra: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), frecuencia_promedio_dias: 15, is_verified: true, direccion: { calle: 'Av. Corrientes 1234', ciudad: 'CABA', codigo_postal: '1043', lat: -34.6037, lng: -58.3816 } },
    { id: 'cust-2', restaurant_id: demoRestaurantId, nombre: 'María García', telefono: '1198765432', email: 'maria.garcia@example.com', ltv: 2300, ultima_compra: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), frecuencia_promedio_dias: 30, is_verified: false, direccion: { calle: 'Florida 550', ciudad: 'CABA', codigo_postal: '1005', lat: -34.605, lng: -58.376 } },
    { id: 'cust-3', restaurant_id: demoRestaurantId, nombre: 'Cliente Borrable', telefono: '1100001111', email: 'borrable@example.com', ltv: 0, ultima_compra: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), frecuencia_promedio_dias: 0, is_verified: false, direccion: { calle: 'Calle Falsa 123', ciudad: 'CABA', codigo_postal: '1425', lat: -34.58, lng: -58.43 } },
];

export const demoCoupons: Coupon[] = [
    { id: 'coupon-1', restaurant_id: demoRestaurantId, codigo: 'BIENVENIDO10', tipo: 'PORCENTAJE', valor: 10, activo: true, expira_en: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), minimo_subtotal: null },
    { id: 'coupon-2', restaurant_id: demoRestaurantId, codigo: 'PIZZA200', tipo: 'FIJO', valor: 200, activo: true, expira_en: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), minimo_subtotal: 1500 },
];

const now = new Date();
const created2MinsAgo = new Date(now.getTime() - 2 * 60 * 1000).toISOString();
const created10MinsAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
const created30MinsAgo = new Date(now.getTime() - 30 * 60 * 1000).toISOString();

export const demoOrders: Order[] = [
  {
    id: 1, restaurant_id: demoRestaurantId, customer_id: 'cust-1', table_id: 1, creado_por_id: 'user-mozo-1', tipo: OrderType.SALA, estado: OrderStatus.NUEVO,
    subtotal: 1100, descuento: 0, impuestos: 231, propina: 0, total: 1331,
    items: [{ id: 'oi-1', menu_item_id: 'item-1', nombre_item_snapshot: 'Pizza Muzzarella', precio_unitario: 850, cantidad: 1, total_item: 850 }, { id: 'oi-2', menu_item_id: 'item-3', nombre_item_snapshot: 'Gaseosa Cola 500ml', precio_unitario: 250, cantidad: 1, total_item: 250 }],
    creado_en: created2MinsAgo, repartidor_id: null, payments: [], mozo_id: 'user-mozo-1',
  },
  {
    id: 2, restaurant_id: demoRestaurantId, customer_id: null, table_id: undefined, creado_por_id: 'user-gerente-1', tipo: OrderType.PARA_LLEVAR, estado: OrderStatus.EN_PREPARACION,
    subtotal: 980, descuento: 0, impuestos: 205.8, propina: 0, total: 1185.8,
    items: [{ id: 'oi-3', menu_item_id: 'item-2', nombre_item_snapshot: 'Pizza Jamón y Morrones', precio_unitario: 980, cantidad: 1, total_item: 980 }],
    creado_en: created10MinsAgo, repartidor_id: null, payments: [], mozo_id: null,
  },
  {
    id: 3, restaurant_id: demoRestaurantId, customer_id: 'cust-2', table_id: undefined, creado_por_id: 'user-admin-1', tipo: OrderType.DELIVERY, estado: OrderStatus.LISTO,
    subtotal: 1600, descuento: 0, impuestos: 336, propina: 0, total: 1936,
    items: [{ id: 'oi-4', menu_item_id: 'item-2', nombre_item_snapshot: 'Pizza Jamón y Morrones', precio_unitario: 980, cantidad: 1, total_item: 980 }, { id: 'oi-5', menu_item_id: 'item-4', nombre_item_snapshot: 'Cerveza Lager 1L', precio_unitario: 600, cantidad: 1, total_item: 600, notes: 'Bien fría' }],
    creado_en: created30MinsAgo, repartidor_id: null, payments: [{ status: 'PAGADO', method: 'MERCADOPAGO', amount: 1936, creado_en: created30MinsAgo }], mozo_id: null,
  },
];

// --- MESAS Y PLANO DEL SALÓN ---
export const demoTables: Table[] = [
    { id: 1, nombre: 'Mesa 1', estado: TableStatus.OCUPADA, order_id: 1, mozo_id: 'user-mozo-1', x: 50, y: 50, shape: 'square' },
    { id: 2, nombre: 'Mesa 2', estado: TableStatus.LIBRE, order_id: null, mozo_id: null, x: 200, y: 50, shape: 'square' },
    { id: 3, nombre: 'Mesa 3', estado: TableStatus.LIBRE, order_id: null, mozo_id: null, x: 50, y: 200, shape: 'rectangle-h' },
    { id: 4, nombre: 'Mesa 4', estado: TableStatus.NECESITA_LIMPIEZA, order_id: null, mozo_id: null, x: 350, y: 150, shape: 'rectangle-v' },
];


// --- CONFIGURACIÓN ---
export const demoRestaurantSettings: RestaurantSettings = {
  nombre: 'Pizzeria Pizarra',
  logo_url: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
  direccion: 'Av. Siempre Viva 742, CABA',
  telefono: '+54 9 11 1234-5678',
  horarios: 'Lunes a Viernes: 12:00 - 23:00\nSábados y Domingos: 12:00 - 00:00',
  iva_rate: 21,
  precios_con_iva: true,
  propina_opciones: [5, 10, 15],
};