import React, { useState, useEffect } from 'react';
import { X, Calendar, ClipboardCheck, Truck, ShieldCheck, HelpCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectSize: string) => void;
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [cep, setCep] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingDays, setShippingDays] = useState<number | null>(null);
  const [calculatingZip, setCalculatingZip] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes.length === 1 ? product.sizes[0] : '');
      setQuantity(1);
      setShippingCost(null);
      setShippingDays(null);
      setCep('');
    }
  }, [product]);

  if (!product) return null;

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.replace(/\D/g, '').length !== 8) return;

    setCalculatingZip(true);
    // Mimic Correios API delay
    setTimeout(() => {
      // Freight is the base product freight, adjusted slightly based on ZIP prefix
      const suffix = parseInt(cep.substring(0, 2)) || 30;
      let costRatio = 1.0;
      let days = 5;

      if (suffix >= 1 && suffix <= 19) {
        // SP
        costRatio = 0.8;
        days = 2;
      } else if (suffix >= 20 && suffix <= 28) {
        // RJ/ES
        costRatio = 1.0;
        days = 4;
      } else if (suffix >= 30 && suffix <= 39) {
        // MG
        costRatio = 0.9;
        days = 3;
      } else if (suffix >= 40 && suffix <= 49) {
        // BA
        costRatio = 1.3;
        days = 7;
      } else {
        // Rest of Brazil
        costRatio = 1.5;
        days = 9;
      }

      setShippingCost(product.freight * costRatio);
      setShippingDays(days);
      setCalculatingZip(false);
    }, 850);
  };

  const handleAdd = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      alert('Por favor, selecione um tamanho antes de prosseguir.');
      return;
    }
    onAddToCart(product, quantity, selectedSize || 'Único');
  };

  return (
    <div id="product-modal-backdrop" className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="product-modal-content"
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row my-4 sm:my-8 max-h-[92vh] md:max-h-none overflow-y-auto md:overflow-y-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 text-gray-500 bg-white/95 hover:bg-gray-100 hover:text-gray-900 rounded-full shadow-md transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4 sm:p-8 border-r border-gray-100 relative shrink-0">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-44 sm:h-64 md:h-full max-h-[220px] sm:max-h-[400px] md:max-h-[450px] object-contain rounded-lg"
          />
        </div>

        {/* Product Info Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Header / Category */}
            <span className="text-xs font-bold font-mono tracking-widest text-blue-600 uppercase">
              {product.category === 'camisas' && 'Camisas de Time'}
              {product.category === 'chuteiras' && 'Chuteiras'}
              {product.category === 'agasalhos' && 'Agasalhos'}
              {product.category === 'acessorios' && 'Acessórios'}
            </span>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 mb-2">
              {product.name}
            </h2>

            {/* Price Tags */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-black text-gray-900">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              {product.oldPrice && (
                <span className="text-sm sm:text-base text-gray-400 line-through">
                  R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-650 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Selecione o Tamanho:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-1 sm:w-32 bg-gray-50">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(prev => prev - 1)}
                  className="px-2.5 py-1.5 text-gray-500 hover:text-gray-900 font-bold transition disabled:opacity-30"
                >
                  -
                </button>
                <span className="font-mono font-bold text-gray-800 text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-2.5 py-1.5 text-gray-500 hover:text-gray-900 font-bold transition disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {product.stock > 0 ? (
                <button
                  onClick={handleAdd}
                  disabled={product.sizes.length > 1 && !selectedSize}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-center"
                >
                  Adicionar ao Carrinho
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 py-3 bg-gray-200 text-gray-400 font-bold text-sm rounded-lg cursor-not-allowed text-center"
                >
                  Esgotado em Estoque
                </button>
              )}
            </div>

            {/* Calculate Shipping Zip-code simulation */}
            <div className="border-t border-gray-150 pt-5">
              <span className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Simular Frete (Correios):
              </span>
              <form onSubmit={handleCalculateShipping} className="flex gap-2">
                <input
                  type="text"
                  maxLength={9}
                  placeholder="Ex: 01310-100"
                  value={cep}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 5) {
                      val = val.slice(0, 5) + '-' + val.slice(5, 8);
                    }
                    setCep(val);
                  }}
                  className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                />
                <button
                  type="submit"
                  disabled={cep.replace(/\D/g, '').length !== 8 || calculatingZip}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold tracking-wide uppercase transition disabled:opacity-40"
                >
                  {calculatingZip ? 'Calculando...' : 'Calcular'}
                </button>
              </form>

              {shippingCost !== null && shippingDays !== null && (
                <div className="mt-3 bg-gray-50 p-3 rounded-lg flex items-center justify-between text-xs border border-gray-100">
                  <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                    <Truck className="h-4 w-4 text-blue-600" />
                    Envio Direct Express:
                  </span>
                  <span className="font-semibold text-gray-800">
                    R$ {shippingCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({shippingDays} dias úteis)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Core assurances footer */}
          <div className="grid grid-cols-2 gap-4 mt-8 border-t border-gray-100 pt-4 text-[11px] text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>Compra 100% Segura</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-blue-600" />
              <span>Garantia de 3 meses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
