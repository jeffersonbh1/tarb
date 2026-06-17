import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import { Product, CartItem, Order, OrderAddress } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data';
import { ChevronLeft, ChevronRight, Award, Shirt, Flame, Zap, ShieldCheck, HelpCircle, MessageCircle } from 'lucide-react';

export default function App() {
  // Products and Orders persistence states
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dsc_catalog_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('dsc_catalog_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dsc_catalog_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('dsc_admin_logged');
    return saved === 'true';
  });

  // UI state managers
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Active Promo Banner Slider indicator
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const banners = [
    {
      title: "MANTOS OFICIAIS 24/25",
      subtitle: "Vista as cores do seu time com tecnologia AeroReady de alta evaporação.",
      badge: "Lançamento",
      cta: "Ver camisas",
      categoryTarget: "camisas",
      bgColor: "bg-gradient-to-r from-red-900 to-black",
      image: "https://images.unsplash.com/photo-1540747737956-3787217abaa5?w=1000&auto=format&fit=crop"
    },
    {
      title: "SPEEDBOOST LINE GOLD",
      subtitle: "Melhore sua arrancada e domine o gramado com tração multidirecional leve.",
      badge: "20% OFF",
      cta: "Conferir chuteiras",
      categoryTarget: "chuteiras",
      bgColor: "bg-gradient-to-r from-emerald-950 to-slate-900",
      image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1000&auto=format&fit=crop"
    },
    {
      title: "TREINO NO INVERNO",
      subtitle: "Corta-ventos térmicos e agasalhos com membrana hidro-repelente ativa.",
      badge: "Frete Reduzido",
      cta: "Explorar coleção",
      categoryTarget: "agasalhos",
      bgColor: "bg-gradient-to-r from-gray-900 to-indigo-950",
      image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=1000&auto=format&fit=crop"
    }
  ];

  // Auto scroll banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dsc_catalog_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dsc_catalog_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dsc_catalog_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('dsc_admin_logged', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // Shopping Cart action workflows
  const handleAddToCart = (product: Product, quantity: number, size: string) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity = Math.min(
          product.stock,
          updated[existingIdx].quantity + quantity
        );
        return updated;
      } else {
        return [...prev, { product, quantity, selectedSize: size }];
      }
    });
    
    // Close item modal and slide open cart for better visual micro-feedback
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleAddToCartDirectly = (product: Product) => {
    const preferredSize = product.sizes.length > 0 ? product.sizes[0] : 'Único';
    handleAddToCart(product, 1, preferredSize);
  };

  const handleUpdateCartQuantity = (productId: string, size: string, quantity: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedSize === size) {
          return { ...item, quantity: Math.min(item.product.stock, quantity) };
        }
        return item;
      });
    });
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    setCartItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedSize === size)
    ));
  };

  // Login handler
  const handleLoginSuccess = (isAdminUser: boolean) => {
    setIsAdmin(isAdminUser);
    if (isAdminUser) {
      setCurrentView('admin');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentView('store');
    alert('Sessão administrativa encerrada com sucesso.');
  };

  // Submit Simulated Checkout Purchase Order
  const handleSubmitOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: OrderAddress;
    paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto';
  }) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalProducts = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const totalFreight = cartItems.reduce((sum, item) => sum + (item.product.freight + (item.quantity - 1) * (item.product.freight * 0.3)), 0);
    const totalSum = totalProducts + totalFreight;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      address: orderData.address,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize
      })),
      totalProducts,
      totalFreight,
      totalSum,
      status: 'Pendente',
      paymentMethod: orderData.paymentMethod
    };

    // Update product stock levels
    setProducts(prev => {
      return prev.map(p => {
        const boughtItem = cartItems.find(it => it.product.id === p.id);
        if (boughtItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - boughtItem.quantity)
          };
        }
        return p;
      });
    });

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Catalog CRUD modifiers
  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const prodId = `prod-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id: prodId
    };
    setProducts(prev => [product, ...prev]);
    alert('Novo produto cadastrado com sucesso no catálogo esportivo!');
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    alert('Especificações do produto editadas com sucesso!');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    alert('Produto deletado permanentemente do inventário.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Filter Catalog display grid (Client UI)
  const clientFilteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Dynamic Header navbar */}
      <Navbar
        isAdmin={isAdmin}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onGoToAdmin={() => setCurrentView('admin')}
        onGoToHome={() => setCurrentView('store')}
        cartCount={cartItems.reduce((count, item) => count + item.quantity, 0)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        currentView={currentView}
      />

      {/* Main Container routes */}
      <main className="flex-grow">
        {currentView === 'store' ? (
          /* Client facing store */
          <div className="pb-16 space-y-12">
            
            {/* Promo Banner Slider block */}
            <section id="promo-hero-slider" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] xs:aspect-[16/9] md:aspect-[21/9] min-h-[340px] sm:min-h-[300px] shadow-lg">
                {banners.map((ban, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 flex flex-col justify-center p-6 sm:p-12 text-white bg-cover bg-center transition-all duration-1000 ease-in-out ${
                      idx === activeBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.25) 100%), url(${ban.image})` }}
                  >
                    <div className="max-w-xl space-y-3 sm:space-y-4 animate-fade-in">
                      <span className="inline-block bg-blue-600 text-[9px] sm:text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 sm:py-1 rounded-full text-white w-fit">
                        {ban.badge}
                      </span>
                      <h2 className="text-2xl sm:text-4xl lg:text-4.5xl font-black tracking-tight leading-tight sm:leading-none text-white">
                        {ban.title}
                      </h2>
                      <p className="text-xs sm:text-base text-gray-300 font-medium line-clamp-2 sm:line-clamp-none">
                        {ban.subtitle}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCategory(ban.categoryTarget);
                          const el = document.getElementById('vitrine-produtos');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center space-x-1.5 px-5 py-2.5 sm:px-6 sm:py-3 bg-white hover:bg-blue-600 hover:text-white text-gray-900 font-extrabold text-xs uppercase tracking-wider rounded-xl transition duration-300 shadow-lg w-fit"
                      >
                        <span>{ban.cta}</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Banner slider indicators dots */}
                <div className="absolute bottom-4 left-6 sm:left-12 z-20 flex space-x-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveBannerIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === activeBannerIndex ? 'w-6 bg-blue-600' : 'w-2 bg-white/40'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Quick trust assurances line */}
            <section className="bg-white border-y border-gray-100 py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center space-y-1.5">
                  <div className="bg-blue-50 p-2 text-blue-600 rounded-full">
                    <Shirt className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">Produtos Originais</span>
                  <p className="text-[11px] text-gray-450">Direto de fornecedores credenciados</p>
                </div>
                
                <div className="flex flex-col items-center space-y-1.5">
                  <div className="bg-blue-50 p-2 text-blue-600 rounded-full">
                    <Flame className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">Preços Imbatíveis</span>
                  <p className="text-[11px] text-gray-450">Ofertas agressivas em saldos selecionados</p>
                </div>

                <div className="flex flex-col items-center space-y-1.5">
                  <div className="bg-blue-50 p-2 text-blue-600 rounded-full">
                    <Zap className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">Expedição Expressa</span>
                  <p className="text-[11px] text-gray-450">Despacho aos Correios em até 24 horas</p>
                </div>

                <div className="flex flex-col items-center space-y-1.5">
                  <div className="bg-blue-50 p-2 text-blue-600 rounded-full">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">Suporte 100% Ativo</span>
                  <p className="text-[11px] text-gray-450">Auxílio pós-venda direto via WhatsApp</p>
                </div>
              </div>
            </section>

            {/* Dynamic Catalog Section */}
            <section id="vitrine-produtos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-baseline justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-930 text-lg sm:text-2xl font-extrabold tracking-tight capitalize">
                    {selectedCategory === 'all' && 'Todos os Produtos'}
                    {selectedCategory === 'camisas' && 'Camisas Oficiais'}
                    {selectedCategory === 'chuteiras' && 'Chuteiras Profissionais'}
                    {selectedCategory === 'agasalhos' && 'Acessórios Térmicos'}
                    {selectedCategory === 'acessorios' && 'Bolas e Acessórios'}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
                    {clientFilteredProducts.length} itens
                  </span>
                </div>
                
                {searchQuery && (
                  <span className="text-xs text-gray-550 leading-none">
                    Resultados para: <strong className="text-blue-650 font-mono">"{searchQuery}"</strong>
                  </span>
                )}
              </div>

              {/* Grid content */}
              {clientFilteredProducts.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center max-w-md mx-auto">
                  <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="font-sans font-bold text-gray-800 mb-1">Nenhum artigo encontrado</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Não encontramos resultados correspondentes na categoria selecionada. Redefina os filtros ou limpe sua busca de texto.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    Ver Tudo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                  {clientFilteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={(p) => setSelectedProduct(p)}
                      onAddToCartDirectly={handleAddToCartDirectly}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          /* Back-end Administration views */
          <AdminDashboard
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* Trust reassurance e-commerce footer */}
      <footer className="bg-white border-t border-gray-150 py-12 text-xs text-gray-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <span className="font-black text-base text-gray-800">
              Tarb <span className="text-blue-650 font-bold">Sports</span>
            </span>
            <p className="leading-relaxed max-w-xs mx-auto md:mx-0">
              Loja simulada de alta performance inspirada na tarbsports.com.br. Camisas de times europeus, nacionais, chuteiras importadas e acessórios esportivos com preços especiais.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <span className="font-bold text-gray-800">Atendimento ao Cliente</span>
            <ul className="space-y-1.5">
              <li>📍 Rua Capri 440, Bandeirantes, Belo Horizonte - MG</li>
              <li>📧 sup.atendimento@tarbsports.com.br</li>
              <li>
                <a
                  href="https://wa.me/5531989907000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20da%20Tarb%20Sports!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 transition flex items-center justify-center md:justify-start gap-1.5 text-gray-600 font-semibold"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10 shrink-0" />
                  <span>WhatsApp: (31) 98990-7000</span>
                </a>
              </li>
              <li>📞 Telefone: (11) 99999-9999 (Segunda a Sexta)</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <span className="font-bold text-gray-800 flex items-center justify-center md:justify-start gap-1">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Ambiente Seguro de Teste
            </span>
            <p className="leading-relaxed text-[11px] text-gray-450 font-mono">
              CNPJ: 01.111.000/0001-00<br />
              Desenvolvido com alta fidelidade visual. Todos os dados, carrinhos, novos produtos criados e pedidos são persistidos de modo sandbox via LocalStorage para facilitar sua experimentação.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 mt-8 pt-6 text-center text-[11px] text-gray-400">
          © {new Date().getFullYear()} Tarb Sports. Todos os direitos reservados.
        </div>
      </footer>

      {/* OVERLAY MODALS WINDOWS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onSubmitOrder={handleSubmitOrder}
        onClearCart={() => setCartItems([])}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Floating WhatsApp support action - Mobile optimized */}
      <a
        href="https://wa.me/5531989907000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20da%20Tarb%20Sports!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white p-3.5 sm:p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group animate-bounce"
        aria-label="Fale conosco no WhatsApp"
        title="Chamar no WhatsApp"
      >
        <MessageCircle className="h-6 w-6 stroke-[2.5]" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out text-sm font-extrabold tracking-wide whitespace-nowrap hidden md:inline-block">
          Fale Conosco
        </span>
      </a>
    </div>
  );
}
