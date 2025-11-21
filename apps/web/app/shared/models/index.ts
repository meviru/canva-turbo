import * as fabric from 'fabric';

// Core command pattern interface
export interface Command {
  execute(): void | Promise<void>;
  undo(): void | Promise<void>;
}

// User related types
export interface User {
  _id: string;
  authId: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Design related types
export interface Design {
  _id: string;
  title: string;
  width: number;
  height: number;
  backgroundColor?: string;
  userId: string;
  isPublic: boolean;
  canvasData?: string; // Serialized canvas JSON
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDesignRequest {
  title: string;
  width: number;
  height: number;
  backgroundColor?: string;
  userId: string;
  isPublic?: boolean;
}

// Canvas and Fabric.js related types
export interface CanvasState {
  canvas: fabric.Canvas | null;
  history: Command[];
  historyIndex: number;
  isLoading: boolean;
}

export interface CanvasObject extends fabric.Object {
  id?: string;
  type: string;
}

// Designer mode types
export interface DesignerMode {
  name: 'Editing' | 'Viewing' | 'Commenting';
  icon: React.ComponentType<any>;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Photo/Asset related types
export interface Photo {
  id: string;
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
  };
  alt_description?: string;
  description?: string;
  user: {
    name: string;
    username: string;
  };
  width: number;
  height: number;
}

export interface PhotoSearchResult {
  total: number;
  total_pages: number;
  results: Photo[];
}

// Upload related types
export interface UploadedAsset {
  _id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnail?: string;
  createdAt: string;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  result?: UploadedAsset;
}

// Redux state types
export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ErrorState {
  message: string;
  code?: string | number;
  details?: any;
}

// Environment and configuration types
export interface AppConfig {
  apiBaseUrl: string;
  uploadsEnabled: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

// Canvas dimensions and viewport types
export interface CanvasDimensions {
  width: number;
  height: number;
  scaleFactor?: number;
}

export interface ViewportTransform {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
}

// Tab configuration types
export interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  isEnabled?: boolean;
}

// Export commonly used fabric types with proper typing
export type FabricCanvas = fabric.Canvas;
export type FabricObject = fabric.Object;
export type FabricImage = fabric.Image;
export type FabricText = fabric.Text;