import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalProductsPrice = cartItems.reduce(
    (sum, item) => sum + (item.product.price * item.quantity),
    0
  );

  // Freight logic: base product freight with small quantity discounts
  const totalFreight = cartItems.reduce(
    (sum, item) => sum + (item.product.freight + (item.quantity - 1) * (item.product.freight * 0.3)),
    0
  );

  const finalTotalSum = totalProductsPrice + totalFreight;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Seu Carrinho</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="font-sans font-bold text-gray-800 text-lg mb-1">Seu carrinho está vazio</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">
                  Adicione camisas oficiais, chuteiras ou acessórios para vencer suas melhores partidas.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-blue-600 font-bold text-sm text-white rounded-xl hover:bg-blue-700 transition shadow-md"
                >
                  Continuar Compras
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}-${index}`}
                    className="flex py-4 [border-bottom:1px_solid_rgb(243,244,246)]"
                  >
                    {/* Item Image */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-sm sm:text-base font-semibold text-gray-900">
                          <h4 className="line-clamp-2 pr-2 text-sm">{item.product.name}</h4>
                          <span className="font-mono text-sm">
                            R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                          Tamanho: <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-bold">{item.selectedSize}</span>
                        </p>
                      </div>

                      <div className="flex flex-1 items-end justify-between text-xs">
                        {/* Quantity Adjusters */}
                        <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 p-0.5">
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            className="px-1.5 py-0.5 font-bold hover:text-gray-900 disabled:opacity-20"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={item.quantity >= item.product.stock}
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            className="px-1.5 py-0.5 font-bold hover:text-gray-900"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                          className="flex items-center gap-1.5 font-medium text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remover</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart totals and Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-6 sm:px-6 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal dos Produtos</span>
                  <span className="font-mono font-medium">
                    R$ {totalProductsPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Frete Consolidado</span>
                  <span className="font-mono font-medium">
                    R$ {totalFreight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-200 pt-3">
                  <span>Total Geral</span>
                  <span className="font-mono text-lg text-blue-700">
                    R$ {finalTotalSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Informative microcopy */}
              <p className="text-[10px] text-gray-550 text-center">
                Preços e fretes simulados em tempo real de acordo com as especificações técnicas brasileiras.
              </p>

              {/* Action checkout button */}
              <button
                id="btn-cart-checkout"
                onClick={onCheckout}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-100 transition flex items-center justify-center gap-2"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
