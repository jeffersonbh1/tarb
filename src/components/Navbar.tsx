import React from 'react';
import { ShoppingBag, User, ShieldAlert, LogOut, Search, Smartphone } from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  isAdmin: boolean;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onGoToAdmin: () => void;
  onGoToHome: () => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  currentView: 'store' | 'admin';
}

export default function Navbar({
  isAdmin,
  onOpenCart,
  onOpenLogin,
  onLogout,
  onGoToAdmin,
  onGoToHome,
  cartCount,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  currentView
}: NavbarProps) {
  return (
    <header id="app-navbar" className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={onGoToHome}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="bg-blue-600 text-white p-2.5 rounded-xl group-hover:bg-blue-700 transition shadow-md shadow-blue-100">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-blue-600 transition">
                Tarb <span className="text-blue-600 font-bold">Sports</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase">Alta Performance</span>
            </div>
          </div>

          {/* Search container - only visible if in Store view */}
          {currentView === 'store' && (
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search-input-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar camisa de time, chuteira, agasalhos..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
                >
                  Limpar
                </button>
              )}
            </div>
          )}

          {/* Action Navigation Buttons */}
          <div className="flex items-center space-x-4">
            
            {/* Store View Link inside Admin Panel */}
            {currentView === 'admin' && (
              <button
                id="btn-nav-view-store"
                onClick={onGoToHome}
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
              >
                Voltar para Loja
              </button>
            )}

            {/* Admin panel Shortcut for Admin Users */}
            {isAdmin && currentView === 'store' && (
              <button
                id="btn-nav-go-admin"
                onClick={onGoToAdmin}
                className="inline-flex items-center space-x-1.5 bg-gray-900 hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm"
              >
                <ShieldAlert className="h-4 w-4 text-blue-400" />
                <span>Painel Admin</span>
              </button>
            )}

            {/* Shopping Cart (only in store view) */}
            {currentView === 'store' && (
              <button
                id="btn-cart-trigger"
                onClick={onOpenCart}
                className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-full transition"
                aria-label="Carrinho"
              >
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-blue-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Login & Profile buttons */}
            {isAdmin ? (
              <div className="flex items-center space-x-2 border-l border-gray-100 pl-4">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-gray-900">Admin</span>
                  <span className="text-[10px] text-blue-600 font-mono font-bold">TARB MANAGER</span>
                </div>
                <button
                  id="btn-nav-logout"
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                  title="Sair como Admin"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-nav-login"
                onClick={onOpenLogin}
                className="inline-flex items-center space-x-1 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-555 rounded-full transition"
                title="Login Administrativo"
              >
                <User className="h-6 w-6" />
                <span className="hidden md:inline text-sm font-medium ml-1">Entrar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search - only in store view */}
        {currentView === 'store' && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="search-input-mobile"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar camisa, chuteira, agasalho..."
                className="block w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Horizontal Filter Rail - Store View Only */}
      {currentView === 'store' && (
        <div className="bg-gray-50 border-t border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 flex space-x-8 py-3 text-sm">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`font-semibold tracking-tight transition pb-1 border-b-2 px-1 ${
                selectedCategory === 'all'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Todos os Produtos
            </button>
            <button
              onClick={() => setSelectedCategory('camisas')}
              className={`font-semibold tracking-tight transition pb-1 border-b-2 px-1 ${
                selectedCategory === 'camisas'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Camisas de Times
            </button>
            <button
              onClick={() => setSelectedCategory('chuteiras')}
              className={`font-semibold tracking-tight transition pb-1 border-b-2 px-1 ${
                selectedCategory === 'chuteiras'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Chuteiras
            </button>
            <button
              onClick={() => setSelectedCategory('agasalhos')}
              className={`font-semibold tracking-tight transition pb-1 border-b-2 px-1 ${
                selectedCategory === 'agasalhos'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Agasalhos e Corta-ventos
            </button>
            <button
              onClick={() => setSelectedCategory('acessorios')}
              className={`font-semibold tracking-tight transition pb-1 border-b-2 px-1 ${
                selectedCategory === 'acessorios'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Bolas e Acessórios
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
