import React, { useState } from 'react';
import { 
  TrendingUp, Package, Truck, Wallet, Plus, Edit2, Trash2, 
  Search, ClipboardList, Check, X, Smartphone, MessageSquare,
  Sparkles, Filter, ChevronRight, BarChart3, AlertCircle, Upload
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function AdminDashboard({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'orders'>('overview');
  
  // Search and filter filters
  const [productQuery, setProductQuery] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product CRUD form states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Fields for Product Form
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'camisas' | 'chuteiras' | 'agasalhos' | 'acessorios'>('camisas');
  const [formPrice, setFormPrice] = useState('');
  const [formOldPrice, setFormOldPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formFreight, setFormFreight] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formSizesInput, setFormSizesInput] = useState('');

  // Selected order details panel state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Stats derivation
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelado')
    .reduce((sum, o) => sum + o.totalSum, 0);

  const pendingCount = orders.filter(o => o.status === 'Pendente').length;
  const averageFreight = products.reduce((sum, p) => sum + p.freight, 0) / (products.length || 1);
  const activeProductsCount = products.length;

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('camisas');
    setFormPrice('');
    setFormOldPrice('');
    setFormDescription('');
    setFormImage('');
    setFormFreight('19.90'); // standard default freight
    setFormStock('15');
    setFormSizesInput('P, M, G, GG');
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormOldPrice(product.oldPrice ? product.oldPrice.toString() : '');
    setFormDescription(product.description);
    setFormImage(product.image);
    setFormFreight(product.freight.toString());
    setFormStock(product.stock.toString());
    setFormSizesInput(product.sizes.join(', '));
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formDescription || !formImage || !formStock) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const sizesArray = formSizesInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const productPayload = {
      name: formName,
      category: formCategory,
      price: parseFloat(formPrice),
      oldPrice: formOldPrice ? parseFloat(formOldPrice) : undefined,
      description: formDescription,
      image: formImage || 'https://images.unsplash.com/photo-1540747737956-3787217abaa5',
      sizes: sizesArray.length > 0 ? sizesArray : ['P', 'M', 'G', 'GG'],
      freight: parseFloat(formFreight || '0'),
      stock: parseInt(formStock),
      featured: editingProduct ? editingProduct.featured : false
    };

    if (editingProduct) {
      onUpdateProduct({
        ...productPayload,
        id: editingProduct.id
      });
    } else {
      onAddProduct(productPayload);
    }

    setIsFormModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item do catálogo?')) {
      onDeleteProduct(id);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Imagens muito grandes podem deixar o carregamento lento. Recomendamos imagens de até 3MB.');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filter lists
  const filteredProducts = products.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(productQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(productQuery.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesQuery && matchesCat;
  });

  const filteredOrders = orders.filter(o => {
    const matchesQuery = o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) || 
                         o.id.toLowerCase().includes(orderQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner Header */}
      <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 bg-blue-600/20 w-48 h-48 rounded-full pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 translate-y-16 bg-blue-500/10 w-96 h-96 rounded-full pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="bg-blue-600 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              Painel de Controle Ativo
            </span>
            <h1 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight mt-2.5">
              Tarb Sports Manager
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Gerencie catálogo, preços, fretes e atualize os status de pedidos de forma intuitiva.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition ${
                activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-gray-800 hover:bg-gray-750 text-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition ${
                activeTab === 'catalog' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-gray-800 hover:bg-gray-750 text-gray-300'
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition ${
                activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-gray-800 hover:bg-gray-750 text-gray-300'
              }`}
            >
              Pedidos ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Visão Geral (Overview) Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* KPI 1: Revenue */}
            <div className="bg-white p-5 border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Faturamento</span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <p className="text-[10px] text-blue-600 font-medium">Lucro real de vendas simuladas</p>
              </div>
              <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                <Wallet className="h-6 w-6" />
              </div>
            </div>

            {/* KPI 2: Active Orders */}
            <div className="bg-white p-5 border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pendentes</span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">{pendingCount} Pedidos</h3>
                <p className="text-[10px] text-amber-600 font-medium">Aguardando confirmação de PIX</p>
              </div>
              <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
                <ClipboardList className="h-6 w-6" />
              </div>
            </div>

            {/* KPI 3: Average Product Freight */}
            <div className="bg-white p-5 border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Frete Médio</span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  R$ {averageFreight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-[10px] text-blue-600 font-medium">Ativo sob escala nacional</p>
              </div>
              <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                <Truck className="h-6 w-6" />
              </div>
            </div>

            {/* KPI 4: Total Catalog size */}
            <div className="bg-white p-5 border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produtos Ativos</span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">{activeProductsCount} Itens</h3>
                <p className="text-[10px] text-purple-600 font-medium">Registrados no catálogo virtual</p>
              </div>
              <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Quick Analytics Visualizer using elegant semantic HTML bars */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between border-b pb-4 mb-5">
                <h4 className="font-sans font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Distribuição de Vendas das Categorias (Porcentagem)</span>
                </h4>
              </div>
              
              <div className="space-y-5">
                {/* Categoras visualization */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Camisas de Time</span>
                    <span className="font-mono">55% das Compras</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '55%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Chuteiras</span>
                    <span className="font-mono">25% das Compras</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: '25%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Agasalhos</span>
                    <span className="font-mono">12% das Compras</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: '12%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Acessórios e Bolas</span>
                    <span className="font-mono">8% das Compras</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full transition-all duration-500" style={{ width: '8%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Support Advice block */}
            <div className="bg-gray-50 border border-gray-150 p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase font-mono flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Instruções Administrativas
                </span>
                <h4 className="font-sans font-bold text-gray-850 text-sm">Controle de Fluxos de Venda</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Para fins e testes, quando simular um novo pedido na interface da loja, mude para a aba <strong>Pedidos</strong> para mudar o status de "Pendente" para "Enviado/Entregue". Você também pode testar as rotinas de alteração de preço para recalcular instantaneamente os valores agregados na vitrine.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 mt-6 flex justify-between items-center text-xs text-gray-450 font-mono">
                <span>Versão v1.0.4 TARB</span>
                <span>Status Ativo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Control Tab */}
      {activeTab === 'catalog' && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
              {/* Search products input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar por nome no catálogo..."
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 text-sm rounded-xl outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center border border-gray-200 rounded-lg px-2 bg-gray-550">
                <Filter className="h-4 w-4 text-gray-400 mr-1 shrink-0" />
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="text-xs outline-none bg-transparent py-2 pr-1 font-semibold text-gray-600 cursor-pointer"
                >
                  <option value="all">Todas Categorias</option>
                  <option value="camisas">Camisas</option>
                  <option value="chuteiras">Chuteiras</option>
                  <option value="agasalhos">Agasalhos</option>
                  <option value="acessorios">Acessórios</option>
                </select>
              </div>
            </div>

            <button
              id="btn-admin-add-product"
              onClick={handleOpenAddForm}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5 justify-center shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Produto</span>
            </button>
          </div>

          {/* Catalog Products Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100 text-left text-xs sm:text-sm">
              <thead className="bg-gray-50/70 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th scope="col" className="px-6 py-4">Produto</th>
                  <th scope="col" className="px-6 py-4">Categoria</th>
                  <th scope="col" className="px-6 py-4">Preço (R$)</th>
                  <th scope="col" className="px-6 py-4">Valor Antigo (R$)</th>
                  <th scope="col" className="px-6 py-4">Frete (R$)</th>
                  <th scope="col" className="px-6 py-4">Estoque</th>
                  <th scope="col" className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400 font-medium text-xs">
                      Nenhum produto cadastrado que atenda a essa busca.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-3.5 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-contain border border-gray-100 rounded bg-gray-50 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">Tamanhos: {p.sizes.join(', ')}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 capitalize font-medium text-gray-500">
                        {p.category === 'camisas' && 'Camisa'}
                        {p.category === 'chuteiras' && 'Chuteira'}
                        {p.category === 'agasalhos' && 'Agasalho'}
                        {p.category === 'acessorios' && 'Acessório'}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-gray-900">
                        R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3.5 text-gray-400">
                        {p.oldPrice ? `R$ ${p.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Sem desconto'}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-gray-700">
                        R$ {p.freight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3.5 font-mono">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          p.stock <= 3 
                            ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                            : 'bg-blue-50 text-blue-600 border border-blue-50'
                        }`}>
                          {p.stock} unid.
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditForm(p)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition"
                          title="Editar preços e frete"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition"
                          title="Remover produto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Control Tab */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Main List Table */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar por Código ou Cliente..."
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 text-xs rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center border border-gray-200 rounded-lg px-2 bg-gray-550 shrink-0 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-gray-400 mr-1" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="text-xs outline-none bg-transparent py-2 pr-1 font-semibold text-gray-655"
                >
                  <option value="all">Satus (Todos)</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Processando">Processando</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Entregue">Entregue</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                <thead className="bg-gray-50/70 text-gray-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th scope="col" className="px-4 py-4">Cod / Data</th>
                    <th scope="col" className="px-4 py-4">Cliente</th>
                    <th scope="col" className="px-4 py-4 font-mono">Total (R$)</th>
                    <th scope="col" className="px-4 py-4">Forma</th>
                    <th scope="col" className="px-4 py-4">Status</th>
                    <th scope="col" className="px-4 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400 font-medium text-xs">
                        Nenhum pedido de compra registrado.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr 
                        key={o.id} 
                        onClick={() => setSelectedOrder(o)}
                        className={`cursor-pointer transition hover:bg-gray-50/80 ${
                          selectedOrder?.id === o.id ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm inline-block font-mono text-[10px]">
                            {o.id}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">
                            {new Date(o.date).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-gray-900">{o.customerName}</div>
                          <div className="text-[10px] text-gray-450">{o.customerPhone}</div>
                        </td>
                        <td className="px-4 py-3.5 font-bold font-mono text-gray-900">
                          R$ {o.totalSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 font-medium">
                          {o.paymentMethod}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                            o.status === 'Pendente' && 'bg-amber-50 text-amber-600 border border-amber-100'
                          } ${
                            o.status === 'Processando' && 'bg-blue-50 text-blue-600 border border-blue-100'
                          } ${
                            o.status === 'Enviado' && 'bg-indigo-50 text-indigo-600 border border-indigo-105'
                          } ${
                            o.status === 'Entregue' && 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          } ${
                            o.status === 'Cancelado' && 'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-gray-400 group-hover:text-blue-600">
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Detail / Action Panel */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Title badge */}
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h4 className="font-sans font-black text-gray-900 text-base">Pedido {selectedOrder.id}</h4>
                    <p className="text-[10px] text-gray-450 font-mono mt-0.5">Criado em {new Date(selectedOrder.date).toLocaleString('pt-BR')}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                    selectedOrder.status === 'Pendente' && 'bg-amber-50 text-amber-600 border border-amber-100'
                  } ${
                    selectedOrder.status === 'Processando' && 'bg-blue-50 text-blue-600 border border-blue-100'
                  } ${
                    selectedOrder.status === 'Enviado' && 'bg-indigo-50 text-indigo-600 border border-indigo-105'
                  } ${
                    selectedOrder.status === 'Entregue' && 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  } ${
                    selectedOrder.status === 'Cancelado' && 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Main Client info */}
                <div className="space-y-3.5 text-xs">
                  <h5 className="font-bold text-gray-700 uppercase tracking-widest font-mono text-[10px] border-b pb-1">Contato do Comprador</h5>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-800">{selectedOrder.customerName}</p>
                    <p className="text-gray-500">{selectedOrder.customerEmail}</p>
                    <p className="text-gray-500">{selectedOrder.customerPhone}</p>
                  </div>

                  <h5 className="font-bold text-gray-700 uppercase tracking-widest font-mono text-[10px] border-b pb-1 pt-2">Local de Envio</h5>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {selectedOrder.address.street}, n° {selectedOrder.address.number}<br />
                    {selectedOrder.address.neighborhood} - {selectedOrder.address.city}/{selectedOrder.address.state}<br />
                    CEP: {selectedOrder.address.zipCode}
                  </p>
                </div>

                {/* Items detail list */}
                <div className="space-y-3">
                  <h5 className="font-bold text-gray-700 uppercase tracking-widest font-mono text-[10px] border-b pb-1">Produtos Comprados</h5>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto scrollbar-none pr-1">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex gap-2 text-xs py-1">
                        <img 
                          src={it.productImage} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 object-contain rounded bg-gray-50 border shrink-0" 
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-gray-800 line-clamp-1">{it.productName}</p>
                          <p className="text-[10px] text-gray-400">Tamanho: {it.selectedSize} ({it.quantity}x)</p>
                        </div>
                        <span className="font-semibold text-gray-800 self-center">
                          R$ {it.price.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtotals detail */}
                <div className="border-t border-gray-150 pt-4 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-550">
                    <span>Subtotal</span>
                    <span className="font-mono">R$ {selectedOrder.totalProducts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-550">
                    <span>Frete</span>
                    <span className="font-mono">R$ {selectedOrder.totalFreight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-901 border-t border-gray-200 pt-2 text-sm">
                    <span>Total do Pedido</span>
                    <span className="font-mono text-blue-700">R$ {selectedOrder.totalSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Select dispatch Action */}
                <div className="space-y-2.5 pt-4 border-t border-gray-150">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Alterar Status de Despacho:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(selectedOrder.id, 'Processando');
                        setSelectedOrder({...selectedOrder, status: 'Processando'});
                      }}
                      className="py-2 bg-blue-50 text-blue-700 text-[11px] font-bold uppercase rounded-lg border border-blue-100 hover:bg-blue-100 transition text-center"
                    >
                      Processando
                    </button>
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(selectedOrder.id, 'Enviado');
                        setSelectedOrder({...selectedOrder, status: 'Enviado'});
                      }}
                      className="py-2 bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase rounded-lg border border-indigo-100 hover:bg-indigo-100 transition text-center"
                    >
                      Enviado
                    </button>
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(selectedOrder.id, 'Entregue');
                        setSelectedOrder({...selectedOrder, status: 'Entregue'});
                      }}
                      className="py-2 bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase rounded-lg border border-emerald-100 hover:bg-emerald-100 transition text-center"
                    >
                      Entregue
                    </button>
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(selectedOrder.id, 'Cancelado');
                        setSelectedOrder({...selectedOrder, status: 'Cancelado'});
                      }}
                      className="py-2 bg-red-50 text-red-700 text-[11px] font-bold uppercase rounded-lg border border-red-100 hover:bg-red-100 transition text-center"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

                {/* Whatsapp Support triggers */}
                <button
                  onClick={() => {
                    const trackingMessage = `Olá ${selectedOrder.customerName}! Tudo bem? Sou da equipe Tarb Sports ⚽. Estou entrando em contato para informar que o status do seu pedido #${selectedOrder.id} foi atualizado para: ${selectedOrder.status}. Agradecemos sua preferência!`;
                    window.open(`https://wa.me/55${selectedOrder.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(trackingMessage)}`, '_blank');
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Enviar WhatsApp de Atualização</span>
                </button>
              </div>
            ) : (
              <div className="h-full py-16 flex flex-col items-center justify-center text-center text-gray-400">
                <ClipboardList className="h-12 w-12 text-gray-300 mb-3" />
                <h5 className="font-bold text-gray-700 text-sm mb-1">Nenhum Pedido Selecionado</h5>
                <p className="text-xs max-w-[200px] leading-relaxed">
                  Toque em uma das linhas da tabela de pedidos para conferir os dados cadastrais completos.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Adding/Editing Product Form Overlay Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="px-6 py-4.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-sans font-black text-gray-900 text-base sm:text-lg">
                {editingProduct ? 'Editar Parâmetros do Produto' : 'Cadastrar Novo Artigo Esportivo'}
              </h3>
              <button 
                onClick={() => {
                  setIsFormModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1.5">Nome do Produto *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: Camisa Barcelona Away 24/25"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50/50 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1.5">Categoria *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 outline-none cursor-pointer"
                  >
                    <option value="camisas">Camisas de Times</option>
                    <option value="chuteiras">Chuteiras profissionais</option>
                    <option value="agasalhos">Corta-Ventos & Agasalhos</option>
                    <option value="acessorios">Acessórios Coadjuvantes</option>
                  </select>
                </div>

                {/* Current Stock */}
                <div>
                  <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1.5">Unidades em Estoque *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 outline-none"
                  />
                </div>

                {/* Live Sale Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1.5">Preço Promocional (R$) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="299.90"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 outline-none"
                  />
                </div>

                {/* Old Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1.5">Preço Tradicional (Sem Desc.) (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Apenas se aplicável. Ex: 349.90"
                    value={formOldPrice}
                    onChange={(e) => setFormOldPrice(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 outline-none"
                  />
                </div>

                {/* Base Freight */}
                <div>
                  <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1.5">Frete Fixo Base (R$) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 19.90"
                    value={formFreight}
                    onChange={(e) => setFormFreight(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 outline-none"
                  />
                </div>

                {/* Custom Sizes */}
                <div>
                  <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1.5">Tamanhos Disponíveis (Separar Virgula)</label>
                  <input
                    type="text"
                    placeholder="Ex: P, M, G, GG ou 39, 40, 41"
                    value={formSizesInput}
                    onChange={(e) => setFormSizesInput(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 outline-none"
                  />
                </div>

                {/* Image URL & Local Upload (Option 3) */}
                <div className="sm:col-span-2 border border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                  <span className="block text-xs font-bold text-gray-750 uppercase tracking-widest">Imagem do Produto *</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Method 1: File Upload */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-500">Upload de Arquivo Local</label>
                      <div className="relative flex items-center justify-center border border-gray-200 rounded-xl bg-white p-3 hover:bg-gray-100 cursor-pointer transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center space-y-1">
                          <Upload className="h-5 w-5 mx-auto text-blue-600 animate-pulse" />
                          <span className="block text-xs font-bold text-gray-755">Escolher arquivo...</span>
                          <span className="block text-[10px] text-gray-400">JPG, PNG, WEBP, GIF</span>
                        </div>
                      </div>
                    </div>

                    {/* Method 2: Paste URL */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-500">Ou endereço (URL) da Web</label>
                      <input
                        type="url"
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={formImage && !formImage.startsWith('data:') ? formImage : ''}
                        onChange={(e) => setFormImage(e.target.value)}
                        className="block w-full px-3 py-3 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-[10px] text-gray-400 leading-tight block">
                        Insira um link existente do Unsplash ou de qualquer outro site de hospedagem.
                      </span>
                    </div>
                  </div>

                  {/* Image Preview box if we have formImage */}
                  {formImage && (
                    <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-white shrink-0 shadow-xs">
                        <img 
                          src={formImage} 
                          alt="Previsualização" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-gray-750 truncate">
                          {formImage.startsWith('data:') ? 'Imagem carregada localmente (Base64)' : 'Imagem via URL'}
                        </span>
                        <span className="block text-[10px] text-gray-400 truncate max-w-xs">{formImage}</span>
                        <button 
                          type="button"
                          onClick={() => setFormImage('')}
                          className="text-[10px] font-bold text-red-650 hover:underline mt-1"
                        >
                          Remover Imagem
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1.5 font-mono">Detalhes & Especificações *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Descreva detalhes como tipo de tecido, costuras, indicação de esporte e garantia de alta de performance."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50/50 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-100 pt-5 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-550 rounded-lg text-xs font-bold uppercase transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase transition shadow-md"
                >
                  {editingProduct ? 'Salvar Edição' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
