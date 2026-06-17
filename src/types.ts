export interface Product {
  id: string;
  name: string;
  category: 'camisas' | 'chuteiras' | 'agasalhos' | 'acessorios';
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  sizes: string[];
  freight: number;
  featured: boolean;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface OrderAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: OrderAddress;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    selectedSize: string;
  }[];
  totalProducts: number;
  totalFreight: number;
  totalSum: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto';
}
