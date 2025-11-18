
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo, useRef } from 'react';
import { User, Order, OrderStatus, MenuCategory, MenuItem, Customer, Coupon, Toast, OrderType, UserRole, PaymentDetails, Table, RestaurantSettings, TableStatus, Ingredient, RecipeItem } from '../types';
import { api } from '../services/api';
import { formatCurrency } from '../utils';

interface AppContextType {
  user: User | null;
  users: User[];
  login: (email: string, password_provided: string) => Promise<void>;
  logout: () => void;
  orders: Order[];
  tables: Table[];
  menuItems: MenuItem[];
  processedMenuItems: MenuItem[];
  allItemsForDisplay: MenuItem[];
  categories: MenuCategory[];
  customers: Customer[];
  coupons: Coupon[];
  ingredients: Ingredient[];
  restaurantSettings: RestaurantSettings | null;
  toast: Toast | null;
  updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: number) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'creado_en' | 'estado' | 'repartidor_id' | 'payments' | 'creado_por_id' | 'mozo_id'>) => Promise<Order | null>;
  createPublicOrder: (orderData: Omit<Order, 'id' | 'creado_en' | 'estado' | 'repartidor_id' | 'payments' | 'creado_por_id' | 'mozo_id'>) => Promise<Order | null>;
  createCustomer: (customerData: Omit<Customer, 'id' | 'restaurant_id' | 'ltv' | 'ultima_compra' | 'frecuencia_promedio_dias' | 'is_verified'>) => Promise<Customer | null>;
  updateCustomer: (customerData: Customer) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  findCustomerByContact: (contact: string) => Promise<Customer | undefined>;
  verifyCustomer: (customerId: string) => Promise<void>;
  updateOrder: (orderId: number, orderData: Partial<Omit<Order, 'id' | 'creado_en'>>) => Promise<void>;
  assignRepartidor: (orderId: number, repartidorId: string) => Promise<void>;
  assignMozoToOrder: (orderId: number, mozoId: string | null) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error') => void;
  createCoupon: (couponData: Omit<Coupon, 'id' | 'restaurant_id'>) => Promise<void>;
  updateCoupon: (couponData: Coupon) => Promise<void>;
  deleteCoupon: (couponId: string) => Promise<void>;
  generatePaymentQR: (orderId: number, amount: number) => Promise<string | undefined>;
  addPaymentToOrder: (orderId: number, method: PaymentDetails['method'], amount: number) => Promise<void>;
  createUser: (userData: Omit<User, 'id' | 'restaurant_id' | 'avatar_url'>) => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  createMenuItem: (itemData: Omit<MenuItem, 'id' | 'restaurant_id' | 'coste' | 'stock_actual'>) => Promise<void>;
  updateMenuItem: (itemData: MenuItem) => Promise<void>;
  deleteMenuItem: (itemId: string) => Promise<void>;
  restoreMenuItem: (itemId: string) => Promise<void>;
  updateCategories: (categories: MenuCategory[]) => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateRestaurantSettings: (settings: RestaurantSettings) => Promise<void>;
  cleanTable: (tableId: number) => Promise<void>;
  saveTableLayout: (tables: Table[]) => Promise<void>;
  updateTable: (table: Table) => Promise<void>;
  createIngredient: (data: Omit<Ingredient, 'id' | 'restaurant_id'>) => Promise<void>;
  updateIngredient: (data: Ingredient) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const prevOrdersRef = useRef<Order[]>([]);


  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
      const newToast: Toast = { id: Date.now(), message, type };
      setToast(newToast);
      setTimeout(() => setToast(prev => (prev?.id === newToast.id ? null : prev)), 3000);
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [ordersData, menuItemsData, customersData, couponsData, usersData, categoriesData, settingsData, tablesData, ingredientsData] = await Promise.all([
        api.getOrders(),
        api.getMenuItems(),
        api.getCustomers(),
        api.getCoupons(),
        api.getUsers(),
        api.getCategories(),
        api.getRestaurantSettings(),
        api.getTables(),
        api.getIngredients(),
      ]);
      setOrders(ordersData);
      setMenuItems(menuItemsData);
      setCustomers(customersData);
      setCoupons(couponsData);
      setUsers(usersData);
      setCategories(categoriesData);
      setRestaurantSettings(settingsData);
      setTables(tablesData);
      setIngredients(ingredientsData);
    } catch (error) {
      console.error("Failed to load initial data", error);
      showToast("Error al cargar los datos", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Syncs the previous orders ref with the current state for comparison.
  useEffect(() => {
    prevOrdersRef.current = orders;
  }, [orders]);


  // Real-time notification polling effect
  useEffect(() => {
    if (!user) return; // No polling if not logged in

    let notificationSound: HTMLAudioElement | null = null;
    try {
        notificationSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_2c244a341b.mp3');
    } catch (e) {
        console.error("Could not create audio element", e);
    }

    const intervalId = setInterval(async () => {
        const currentOrders = prevOrdersRef.current;
        if (!currentOrders) return;
        
        const newOrders = await api.getOrders();

        if (JSON.stringify(currentOrders) === JSON.stringify(newOrders)) {
            return; // No changes, do nothing
        }

        // --- Kitchen Notification ---
        if ([UserRole.ADMIN, UserRole.GERENTE, UserRole.COCINA].includes(user.rol)) {
            const currentNewOrderIds = new Set(currentOrders.filter(o => o.estado === OrderStatus.NUEVO).map(o => o.id));
            const newlyArrivedOrders = newOrders.filter(o => o.estado === OrderStatus.NUEVO && !currentNewOrderIds.has(o.id));

            if (newlyArrivedOrders.length > 0) {
                showToast(`¡Nuevo pedido #${newlyArrivedOrders[0].id} en cocina!`, 'success');
                if (notificationSound) {
                    notificationSound.play().catch(e => console.error("Sound play failed", e));
                }
            }
        }

        // --- Delivery Staff Notifications ---
        if (user.rol === UserRole.REPARTO) {
            const myOldOrdersMap = new Map<number, Order>(
                currentOrders.filter(o => o.repartidor_id === user.id).map(o => [o.id, o])
            );
            const myNewOrders = newOrders.filter(o => o.repartidor_id === user.id);

            myNewOrders.forEach(newOrder => {
                const oldOrder = myOldOrdersMap.get(newOrder.id);
                
                // Newly assigned delivery
                if (!oldOrder) {
                     // Only notify if it's an active assignment (Ready or On the way)
                     if ([OrderStatus.LISTO, OrderStatus.EN_CAMINO].includes(newOrder.estado)) {
                        showToast(`📦 ¡Nuevo pedido asignado! #${newOrder.id}`, 'success');
                        if (notificationSound) {
                            notificationSound.play().catch(e => console.error("Sound play failed", e));
                        }
                     }
                }
                // Status change on an existing delivery
                else if (oldOrder.estado !== newOrder.estado) {
                    showToast(`Pedido #${newOrder.id} actualizado: ${newOrder.estado}`, 'success');
                    if (notificationSound) {
                        notificationSound.play().catch(e => console.error("Sound play failed", e));
                    }
                }
            });
        }
        
        // Update the main state to keep the UI in sync across the app
        setOrders(newOrders);

    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [user, showToast]);

  const login = async (email: string, password_provided: string) => {
    const selectedUser = await api.login(email, password_provided);
    if (selectedUser) {
      setUser(selectedUser);
    } else {
      showToast("Email o contraseña incorrectos", "error");
    }
  };

  const logout = () => {
    setUser(null);
  };

  const allItemsForDisplay = useMemo(() => {
    if (!menuItems.length) {
        return [];
    }
    
    const ingredientsMap: Map<string, Ingredient> = new Map(ingredients.map(i => [i.id, i]));

    return menuItems.map(item => {
        let calculatedCost = 0;
        let canMake = Infinity;
        let isAvailable = item.disponible;

        if (item.receta && item.receta.length > 0) {
            for (const recipeItem of item.receta) {
                const ingredient = ingredientsMap.get(recipeItem.ingredient_id);
                if (ingredient) {
                    calculatedCost += ingredient.coste_unitario * recipeItem.cantidad;
                    if (recipeItem.cantidad > 0) {
                        const possibleCount = Math.floor(ingredient.stock_actual / recipeItem.cantidad);
                        if (possibleCount < canMake) {
                            canMake = possibleCount;
                        }
                    }
                } else {
                    canMake = 0;
                }
            }
        }
        
        const stockActual = canMake === Infinity ? null : canMake;

        if (!item.permite_venta_sin_stock && stockActual !== null && stockActual <= 0) {
            isAvailable = false;
        }
        
        return {
            ...item,
            coste: calculatedCost,
            stock_actual: stockActual,
            disponible: isAvailable,
        };
    });
  }, [menuItems, ingredients]);

  const processedMenuItems = useMemo(() => {
    return allItemsForDisplay.filter(item => !item.is_deleted);
  }, [allItemsForDisplay]);


  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const originalOrder = orders.find(o => o.id === orderId);
      const updatedOrder = await api.updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId ? updatedOrder : order
      ));

      if (originalOrder?.estado !== OrderStatus.EN_PREPARACION && newStatus === OrderStatus.EN_PREPARACION) {
          await api.deductStockForOrder(orderId);
          const updatedIngredients = await api.getIngredients();
          setIngredients(updatedIngredients);
      }

      if (updatedOrder.tipo === OrderType.DELIVERY) {
        const usersData = await api.getUsers();
        setUsers(usersData);
      }
      showToast(`Pedido #${orderId} actualizado a ${newStatus}`);
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar el pedido", "error");
    }
  };
  
  const cancelOrder = async (orderId: number) => {
    try {
        const updatedOrder = await api.cancelOrder(orderId);
        setOrders(prevOrders => prevOrders.map(order =>
            order.id === orderId ? updatedOrder : order
        ));
        
        // reload related data that might have changed
        const [updatedIngredients, updatedUsers, updatedTables] = await Promise.all([
            api.getIngredients(),
            api.getUsers(),
            api.getTables()
        ]);
        setIngredients(updatedIngredients);
        setUsers(updatedUsers);
        setTables(updatedTables);
        showToast(`Pedido #${orderId} ha sido cancelado.`);
    } catch (error: any) {
        console.error(error);
        showToast(error.message || "Error al cancelar el pedido", "error");
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'creado_en' | 'estado' | 'repartidor_id' | 'payments' | 'creado_por_id' | 'mozo_id'>): Promise<Order | null> => {
    if (!user) {
        showToast("Error de autenticación. No se pudo crear el pedido.", "error");
        return null;
    }
    try {
      const isSalaOrder = orderData.tipo === OrderType.SALA;
      const mozo_id = (isSalaOrder && user?.rol === UserRole.MOZO) ? user.id : null;
      
      const newOrder = await api.createOrder({ ...orderData, creado_por_id: user.id, mozo_id });
      setOrders(prevOrders => [newOrder, ...prevOrders]);

      if (newOrder.tipo === OrderType.SALA && newOrder.table_id) {
          const tableToUpdate = tables.find(t => t.id === newOrder.table_id);
          if (tableToUpdate) {
              await updateTable({
                  ...tableToUpdate,
                  estado: TableStatus.OCUPADA,
                  order_id: newOrder.id,
                  mozo_id: user.id
              });
          }
      }

      if (newOrder.tipo === OrderType.DELIVERY) {
        const usersData = await api.getUsers();
        setUsers(usersData);
      }
      showToast(`Pedido #${newOrder.id} creado.`);
      return newOrder;
    } catch (error) {
      console.error(error);
      showToast("Error al crear el pedido", "error");
      return null;
    }
  };

  const createPublicOrder = async (orderData: Omit<Order, 'id' | 'creado_en' | 'estado' | 'repartidor_id' | 'payments' | 'creado_por_id' | 'mozo_id'>): Promise<Order | null> => {
    try {
      const newOrder = await api.createPublicOrder(orderData);
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      showToast(`Pedido #${newOrder.id} recibido. ¡Gracias!`);
      return newOrder;
    } catch (error) {
      console.error(error);
      showToast("Error al crear el pedido", "error");
      return null;
    }
  };

  const createCustomer = async (customerData: Omit<Customer, 'id' | 'restaurant_id' | 'ltv' | 'ultima_compra' | 'frecuencia_promedio_dias' | 'is_verified'>): Promise<Customer | null> => {
    try {
      const newCustomer = await api.createCustomer(customerData);
      setCustomers(prev => [newCustomer, ...prev].sort((a,b) => a.nombre.localeCompare(b.nombre)));
      showToast(`Cliente '${newCustomer.nombre}' creado con éxito.`);
      return newCustomer;
    } catch (error) {
      console.error(error);
      showToast("Error al crear el cliente", "error");
      return null;
    }
  };

  const findCustomerByContact = async (contact: string): Promise<Customer | undefined> => {
    try {
        return await api.findCustomerByContact(contact);
    } catch (error) {
        console.error(error);
        showToast("Error al buscar cliente", "error");
        return undefined;
    }
  };

  const verifyCustomer = async (customerId: string) => {
    try {
        const updatedCustomer = await api.verifyCustomer(customerId);
        setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
        showToast("Cliente verificado con éxito.", "success");
    } catch (error) {
        console.error(error);
        showToast("Error al verificar cliente", "error");
    }
  };


  const updateCustomer = async (customerData: Customer) => {
    try {
      const updatedCustomer = await api.updateCustomer(customerData);
      setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      showToast(`Cliente '${updatedCustomer.nombre}' actualizado correctamente.`);
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar el cliente", "error");
    }
  };
  
  const deleteCustomer = async (customerId: string) => {
    try {
      await api.deleteCustomer(customerId);
      const updatedCustomers = await api.getCustomers(); // Vuelve a cargar los clientes para asegurar consistencia
      setCustomers(updatedCustomers); // Actualiza el estado con la lista fresca
      showToast(`Cliente desactivado con éxito.`);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Error al desactivar el cliente", "error");
    }
  };
  
  const updateOrder = async (orderId: number, orderData: Partial<Omit<Order, 'id' | 'creado_en'>>) => {
    try {
      if (orderData.tipo === OrderType.DELIVERY && orderData.customer_id) {
          const customer = customers.find(c => c.id === orderData.customer_id);
          if (!customer?.is_verified) {
              showToast("No se puede cambiar a Delivery. El cliente seleccionado no está verificado.", "error");
              return;
          }
      }

      const updatedOrder = await api.updateOrder(orderId, orderData);
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      showToast(`Pedido #${orderId} actualizado con éxito`);
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar el pedido", "error");
    }
  };

  const assignRepartidor = async (orderId: number, repartidorId: string) => {
    try {
      const updatedOrder = await api.assignRepartidorToOrder(orderId, repartidorId);
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      const usersData = await api.getUsers();
      setUsers(usersData);
      showToast(`Pedido #${orderId} asignado con éxito.`);
    } catch (error) {
      console.error(error);
      showToast("Error al asignar repartidor", "error");
    }
  };

  const assignMozoToOrder = async (orderId: number, mozoId: string | null) => {
    try {
        const updatedOrder = await api.updateOrder(orderId, { mozo_id: mozoId });
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        showToast(`Mozo/a asignado al pedido #${orderId}.`);
    } catch (error) {
        console.error(error);
        showToast("Error al asignar mozo/a", "error");
    }
  };

  const createCoupon = async (couponData: Omit<Coupon, 'id' | 'restaurant_id'>) => {
    try {
      const newCoupon = await api.createCoupon({ ...couponData, restaurant_id: 'rest-pizarra-01' });
      setCoupons(prev => [newCoupon, ...prev].sort((a, b) => (a.activo === b.activo) ? 0 : a.activo ? -1 : 1));
      showToast(`Cupón '${newCoupon.codigo}' creado con éxito.`);
    } catch (error) {
      console.error(error);
      showToast("Error al crear el cupón", "error");
    }
  };

  const updateCoupon = async (couponData: Coupon) => {
    try {
      const updatedCoupon = await api.updateCoupon(couponData);
      setCoupons(prev => prev.map(c => c.id === updatedCoupon.id ? updatedCoupon : c));
      showToast(`Cupón '${updatedCoupon.codigo}' actualizado con éxito.`);
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar el cupón", "error");
    }
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      await api.deleteCoupon(couponId);
      setCoupons(prev => prev.filter(c => c.id !== couponId));
      showToast(`Cupón eliminado con éxito.`);
    } catch (error) {
      console.error(error);
      showToast("Error al eliminar el cupón", "error");
    }
  };

  const generatePaymentQR = async (orderId: number, amount: number): Promise<string | undefined> => {
    try {
        const updatedOrder = await api.generatePaymentQR(orderId, amount);
        const qrCodeUrl = (updatedOrder as any).last_qr_code_url;
        setOrders(prevOrders => prevOrders.map(order =>
            order.id === orderId ? updatedOrder : order
        ));
        showToast("QR de pago generado para el pedido #" + orderId);
        return qrCodeUrl;
    } catch (error) {
        console.error(error);
        showToast("Error al generar el código QR", "error");
    }
    return undefined;
  };

  const addPaymentToOrder = async (orderId: number, method: PaymentDetails['method'], amount: number) => {
    try {
        const originalOrder = orders.find(o => o.id === orderId);
        const updatedOrder = await api.addPaymentToOrder(orderId, method!, amount);
        setOrders(prevOrders => prevOrders.map(order =>
            order.id === orderId ? updatedOrder : order
        ));
        
        if (originalOrder && originalOrder.tipo === OrderType.SALA && originalOrder.table_id) {
            const totalPaid = updatedOrder.payments.reduce((sum, p) => sum + p.amount, 0);
            if(totalPaid >= updatedOrder.total) {
                const tableToUpdate = tables.find(t => t.id === originalOrder.table_id);
                if (tableToUpdate) {
                    await updateTable({
                        ...tableToUpdate,
                        estado: TableStatus.NECESITA_LIMPIEZA,
                        order_id: null,
                        mozo_id: null
                    });
                }
            }
        }

        showToast(`Pago de ${formatCurrency(amount)} registrado para el pedido #${orderId}.`);
    } catch (error) {
        console.error(error);
        showToast("Error al procesar el pago", "error");
    }
  };
  
  const createUser = async (userData: Omit<User, 'id' | 'restaurant_id' | 'avatar_url'>) => {
    try {
      const newUser = await api.createUser(userData);
      setUsers(prev => [newUser, ...prev].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      showToast(`Usuario '${newUser.nombre}' creado con éxito.`);
    } catch (error) {
      console.error(error);
      showToast("Error al crear el usuario", "error");
    }
  };

  const updateUser = async (userData: User) => {
    try {
      const updatedUser = await api.updateUser(userData);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      showToast(`Usuario '${updatedUser.nombre}' actualizado con éxito.`);
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar el usuario", "error");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      showToast(`Usuario eliminado con éxito.`);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Error al eliminar el usuario", "error");
    }
  };

  const createMenuItem = async (itemData: Omit<MenuItem, 'id' | 'restaurant_id' | 'coste' | 'stock_actual'>) => {
    try {
      const newItem = await api.createMenuItem(itemData as Omit<MenuItem, 'id' | 'restaurant_id'>);
      setMenuItems(prev => [newItem, ...prev].sort((a,b) => a.nombre.localeCompare(b.nombre)));
      showToast(`Producto '${newItem.nombre}' creado con éxito.`);
    } catch (error) {
      console.error(error);
      showToast("Error al crear el producto", "error");
    }
  };

  const updateMenuItem = async (itemData: MenuItem) => {
    try {
      const updatedItem = await api.updateMenuItem(itemData);
      setMenuItems(prev => prev.map(item => (item.id === updatedItem.id ? updatedItem : item)));
      showToast(`Producto '${updatedItem.nombre}' actualizado con éxito.`);
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar el producto", "error");
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    try {
      const updatedItem = await api.deleteMenuItem(itemId);
      setMenuItems(prev => prev.map(item => item.id === itemId ? updatedItem : item));
      showToast('Producto eliminado con éxito.');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Error al eliminar el producto', 'error');
    }
  };

  const restoreMenuItem = async (itemId: string) => {
    try {
      const updatedItem = await api.restoreMenuItem(itemId);
      setMenuItems(prev => prev.map(item => item.id === itemId ? updatedItem : item));
      showToast('Producto restaurado con éxito.');
    } catch (error) {
      console.error(error);
      showToast('Error al restaurar el producto', 'error');
    }
  };

  const createCategory = async (name: string) => {
    try {
        const newCategory = await api.createCategory(name);
        setCategories(prev => [...prev, newCategory].sort((a, b) => a.orden - b.orden));
        showToast(`Categoría '${name}' creada con éxito.`);
    } catch (error) {
        console.error("Error al crear categoría", error);
        showToast("Error al crear la categoría", "error");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
        await api.deleteCategory(id);
        setCategories(prev => prev.filter(c => c.id !== id));
        showToast("Categoría eliminada con éxito.");
    } catch (error: any) {
        console.error("Error al eliminar categoría", error);
        showToast(error.message || "Error al eliminar la categoría", "error");
    }
  };
  
  const updateCategories = async (updatedCats: MenuCategory[]) => {
    try {
        const newCategories = await api.updateCategories(updatedCats);
        setCategories(newCategories);
        showToast("Orden de categorías actualizado con éxito.");
    } catch (error) {
        console.error("Error al actualizar categorías", error);
        showToast("Error al actualizar las categorías", "error");
    }
  };
  
  const updateRestaurantSettings = async (settings: RestaurantSettings) => {
    try {
      const updatedSettings = await api.updateRestaurantSettings(settings);
      setRestaurantSettings(updatedSettings);
      showToast("Configuración del restaurante guardada con éxito.");
    } catch (error) {
      console.error("Failed to update settings", error);
      showToast("Error al guardar la configuración", "error");
    }
  };

  const updateTable = async (table: Table) => {
    try {
        const updatedTable = await api.updateTable(table);
        setTables(prev => prev.map(t => t.id === updatedTable.id ? updatedTable : t));
    } catch (error) {
        console.error("Error updating table", error);
        showToast("Error al actualizar la mesa.", "error");
    }
  };

  const cleanTable = async (tableId: number) => {
    const tableToClean = tables.find(t => t.id === tableId);
    if(tableToClean) {
        await updateTable({...tableToClean, estado: TableStatus.LIBRE, order_id: null, mozo_id: null});
        showToast(`Mesa ${tableId} marcada como limpia.`);
    }
  };

  const saveTableLayout = async (tablesToSave: Table[]) => {
    try {
        const updatedTables = await api.updateTablesLayout(tablesToSave);
        setTables(updatedTables);
        showToast("Diseño del salón guardado con éxito.");
    } catch (error) {
        console.error("Error saving table layout", error);
        showToast("Error al guardar el diseño del salón.", "error");
    }
  };

  const createIngredient = async (data: Omit<Ingredient, 'id' | 'restaurant_id'>) => {
    try {
        const newIngredient = await api.createIngredient(data);
        setIngredients(prev => [newIngredient, ...prev].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        showToast(`Ingrediente '${newIngredient.nombre}' creado.`);
    } catch (error) {
        showToast("Error al crear ingrediente.", "error");
    }
  };
  
  const updateIngredient = async (data: Ingredient) => {
    try {
        const updated = await api.updateIngredient(data);
        setIngredients(prev => prev.map(i => i.id === updated.id ? updated : i));
        showToast(`Ingrediente '${updated.nombre}' actualizado.`);
    } catch (error) {
        showToast("Error al actualizar ingrediente.", "error");
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
        await api.deleteIngredient(id);
        setIngredients(prev => prev.filter(i => i.id !== id));
        // Menu items relying on this ingredient will also be updated in the backend
        const updatedMenuItems = await api.getMenuItems();
        setMenuItems(updatedMenuItems);
        showToast("Ingrediente eliminado.");
    } catch (error) {
        showToast("Error al eliminar ingrediente.", "error");
    }
  };


  return (
    <AppContext.Provider value={{
      user, users, login, logout, orders, tables, menuItems, processedMenuItems, allItemsForDisplay, categories, customers, coupons, ingredients, restaurantSettings,
      toast, updateOrderStatus, cancelOrder, createOrder, createPublicOrder, showToast, createCustomer, updateCustomer, deleteCustomer,
      findCustomerByContact, verifyCustomer,
      updateOrder, assignRepartidor, assignMozoToOrder, createCoupon, updateCoupon, deleteCoupon,
      generatePaymentQR, addPaymentToOrder, createUser, updateUser, deleteUser,
      createMenuItem, updateMenuItem, deleteMenuItem, restoreMenuItem, updateCategories, createCategory, deleteCategory,
      updateRestaurantSettings,
      cleanTable, saveTableLayout, updateTable,
      createIngredient, updateIngredient, deleteIngredient
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
