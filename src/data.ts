import { Product, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Camisa Seleção Brasileira - Mandante 24/25',
    category: 'camisas',
    price: 349.90,
    oldPrice: 399.90,
    description: 'A Camisa da Seleção Brasileira Edição Especial traz o icônico amarelo canarinho com detalhes inspirados na vibrante cultura brasileira. Feita com tecido tecnológico que absorve o suor e mantém você seco e confortável dentro e fora de campo.',
    image: 'https://images.unsplash.com/photo-1540747737956-3787217abaa5?w=600&auto=format&fit=crop&q=80',
    sizes: ['P', 'M', 'G', 'GG'],
    freight: 19.90,
    featured: true,
    stock: 25
  },
  {
    id: 'prod-2',
    name: 'Chuteira Profissional Campo SpeedBoost Gold',
    category: 'chuteiras',
    price: 699.90,
    oldPrice: 849.90,
    description: 'Projetada para os jogadores mais rápidos do planeta. Com solado de tração multidirecional leve e cabedal texturizado para controle absoluto de bola em alta velocidade. Indicada para gramados naturais firma.',
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&auto=format&fit=crop&q=80',
    sizes: ['38', '39', '40', '41', '42'],
    freight: 24.90,
    featured: true,
    stock: 12
  },
  {
    id: 'prod-3',
    name: 'Corta-Vento Esportivo Training Pro - Preto',
    category: 'agasalhos',
    price: 289.90,
    oldPrice: 329.90,
    description: 'Encare ventanias e treinos frios com o Corta-Vento Athletic Pro. Confeccionado em tecido resistente à água e ultraleve, possui bolsos com zíper e capuz ajustável para proteção extra contra intempéries.',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&auto=format&fit=crop&q=80',
    sizes: ['P', 'M', 'G', 'GG'],
    freight: 15.00,
    featured: true,
    stock: 18
  },
  {
    id: 'prod-4',
    name: 'Camisa Real Madrid - Home 24/25',
    category: 'camisas',
    price: 349.90,
    description: 'O manto sagrado dos merengues para a temporada. Limpo, clássico e imponente com seu tradicional fundo branco e detalhes elegantes em dourado e azul escuro nas mangas. Tecnologia respirável de última geração.',
    image: 'https://images.unsplash.com/photo-1624898191707-88224d77ee2d?w=600&auto=format&fit=crop&q=80',
    sizes: ['P', 'M', 'G', 'GG'],
    freight: 19.90,
    featured: false,
    stock: 30
  },
  {
    id: 'prod-5',
    name: 'Bola de Futebol Classic Match Pro',
    category: 'acessorios',
    price: 159.90,
    oldPrice: 199.90,
    description: 'Bola oficial de treinamento desenvolvida com tecnologia de costura térmica sem costuras externas. Ótima aerodinâmica, excelente retenção de ar e toque macio que melhora os passes de precisão.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    sizes: ['Tamanho Único'],
    freight: 12.90,
    featured: false,
    stock: 45
  },
  {
    id: 'prod-6',
    name: 'Par de Luvas de Goleiro Pro-Grip Titanium',
    category: 'acessorios',
    price: 219.90,
    description: 'Protetor de dedos de nível profissional e palma em látex alemão super macio de 4mm. Garante grip imbatível tanto em clima seco quanto úmido. Fechamento duplo de punho para suporte incomparável.',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&auto=format&fit=crop&q=80',
    sizes: ['8', '9', '10'],
    freight: 14.90,
    featured: false,
    stock: 15
  },
  {
    id: 'prod-7',
    name: 'Camisa Milan AC - Alternativa Preta',
    category: 'camisas',
    price: 339.90,
    oldPrice: 359.90,
    description: 'Com design moderno com elementos urbanos refletivos, a camisa alternativa do Milan destaca-se no asfalto e na arquibancada. Desenvolvida para total liberdade de movimentos dos apaixonados pelo futebol italiano.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80',
    sizes: ['P', 'M', 'G'],
    freight: 19.90,
    featured: false,
    stock: 10
  },
  {
    id: 'prod-8',
    name: 'Mochila Esportiva Impermeável Road-Pack',
    category: 'acessorios',
    price: 189.90,
    description: 'Excelente espaço interno com compartimento isolado e ventilado para chuteiras ou roupas suadas, bolso acolchoado para notebook de até 15 polegadas, e bolsos externos de malha para garrafa térmica.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    sizes: ['Tamanho Único'],
    freight: 15.00,
    featured: false,
    stock: 22
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7402',
    date: '2026-06-16T14:30:00.000Z',
    customerName: 'Marcus Silva Oliveira',
    customerEmail: 'marcus.silva@email.com',
    customerPhone: '(11) 98765-4321',
    address: {
      street: 'Av. Paulista',
      number: '1200',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Camisa Seleção Brasileira - Mandante 24/25',
        productImage: 'https://images.unsplash.com/photo-1540747737956-3787217abaa5?w=600&auto=format&fit=crop&q=80',
        price: 349.90,
        quantity: 1,
        selectedSize: 'M'
      },
      {
        productId: 'prod-5',
        productName: 'Bola de Futebol Classic Match Pro',
        productImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
        price: 159.90,
        quantity: 1,
        selectedSize: 'Tamanho Único'
      }
    ],
    totalProducts: 509.80,
    totalFreight: 32.80,
    totalSum: 542.60,
    status: 'Pendente',
    paymentMethod: 'PIX'
  },
  {
    id: 'ORD-5192',
    date: '2026-06-15T11:15:00.000Z',
    customerName: 'Amanda Pereira Lopes',
    customerEmail: 'amanda.mandal@email.com',
    customerPhone: '(21) 99312-8844',
    address: {
      street: 'Rua Barata Ribeiro',
      number: '450',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22040-002'
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Chuteira Profissional Campo SpeedBoost Gold',
        productImage: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&auto=format&fit=crop&q=80',
        price: 699.90,
        quantity: 1,
        selectedSize: '40'
      }
    ],
    totalProducts: 699.90,
    totalFreight: 24.90,
    totalSum: 724.80,
    status: 'Enviado',
    paymentMethod: 'Cartão de Crédito'
  },
  {
    id: 'ORD-3084',
    date: '2026-06-14T09:05:00.000Z',
    customerName: 'Carlos Eduardo Santos',
    customerEmail: 'cadu.santos@email.com',
    customerPhone: '(31) 97722-5566',
    address: {
      street: 'Rua Aimorés',
      number: '1414',
      neighborhood: 'Lourdes',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30140-071'
    },
    items: [
      {
        productId: 'prod-3',
        productName: 'Corta-Vento Esportivo Training Pro - Preto',
        productImage: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&auto=format&fit=crop&q=80',
        price: 289.90,
        quantity: 1,
        selectedSize: 'G'
      }
    ],
    totalProducts: 289.90,
    totalFreight: 15.00,
    totalSum: 304.90,
    status: 'Entregue',
    paymentMethod: 'Boleto'
  }
];
