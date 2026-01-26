// User types
export interface User {
    id_usuario: number;
    nombre: string;
    email: string;
    telefono: string;
    rol: 'admin' | 'empleado' | 'cliente';
    fecha_registro: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    nombre: string;
    email: string;
    telefono: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user?: User;
}

// Motorcycle types
export interface Motorcycle {
    id_moto: number;
    nombre: string;
    marca: string;
    modelo: string;
    anio: number;
    precio: number;
    descripcion: string;
    id_categoria: number;
    imagen_url: string;
    categoria?: Category;
    deletedAt?: string;
}

export interface CreateMotorcycleDto {
    nombre: string;
    marca: string;
    modelo: string;
    anio: number;
    precio: number;
    descripcion: string;
    id_categoria: number;
    imagen_url: string;
    stock?: number;
}

// Category types
export interface Category {
    id_categoria: number;
    nombre: string;
    descripcion?: string;
}

export interface CreateCategoryDto {
    nombre: string;
    descripcion?: string;
}

// Inventory types
export interface Inventory {
    id_inventario: number;
    id_moto: number;
    stock_actual: number;
    ubicacion: string;
    ultima_actualizacion: string;
    motocicleta?: Motorcycle;
}

export interface UpdateInventoryDto {
    stock_actual?: number;
    ubicacion?: string;
}

export interface CreateInventoryDto {
    id_moto: number;
    stock_actual: number;
    ubicacion: string;
}

// Sale types
export interface Sale {
    id_venta: number;
    id_usuario: number;
    fecha_venta: string;
    total: number;
    metodo_pago: string;
    estado: string;
    usuario?: User;
    detalles?: SaleDetail[];
}

export interface SaleDetail {
    id_detalle: number;
    id_venta: number;
    id_moto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    motocicleta?: Motorcycle;
}

export interface CreateSaleDto {
    id_usuario: number;
    total: number;
    metodo_pago: string;
    estado: string;
    detalles: {
        id_moto: number;
        cantidad: number;
        precio_unitario: number;
    }[];
}

// CRM/Lead types
export interface Lead {
    id_lead: number;
    nombre: string;
    email: string;
    telefono: string;
    mensaje: string;
    estado: string;
    fecha: string;
}

export interface CreateLeadDto {
    nombre: string;
    email: string;
    telefono: string;
    mensaje: string;
    estado?: string;
}

// Cart types (MongoDB)
export interface CartItem extends Motorcycle {
    quantity: number;
}

export interface Cart {
    _id: string;
    id_usuario: number;
    items: CartItem[];
    fecha_creacion: string;
    fecha_actualizacion: string;
}

export interface AddToCartDto {
    id_usuario: number;
    id_moto: number;
    cantidad: number;
    precio_unitario: number;
}

// Comment types (MongoDB)
export interface Comment {
    _id: string;
    usuario_id: number;
    motocicleta_id: number;
    comentario: string;
    calificacion: number;
    fecha: string;
    moderado?: boolean;
    // Optional fields for UI joining
    usuario?: User;
    motocicleta?: Motorcycle;
}

export interface CreateCommentDto {
    id_usuario: number;
    id_moto: number;
    contenido: string;
    calificacion: number;
}

// View History types (MongoDB)
export interface ViewHistory {
    _id: string;
    id_usuario: number;
    id_moto: number;
    fecha_visualizacion: string;
    motocicleta?: Motorcycle;
}

// System Logs types (MongoDB)
export interface SystemLog {
    _id: string;
    usuario_id: number;
    accion: string;
    fecha: string;
    ip?: string;
    detalles?: any;
    usuario?: User;
}

// Pagination
export interface PaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    meta: PaginationMeta;
}

// Common
export interface ApiError {
    statusCode: number;
    message: string | string[];
    error: string;
}
