import React from 'react';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCartDirectly: (product: Product) => void;
  key?: any;
}

export default function ProductCard({ product, onSelect, onAddToCartDirectly }: ProductCardProps) {
  // Calculate discount percentage
  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Badge container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discountPercent > 0 && (
          <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Poucas unidades
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-gray-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Esgotado
          </span>
        )}
      </div>

      {/* Image Container with Actions overlay on Hover */}
      <div className="relative pt-[100%] bg-gray-50 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Hover overlay of quick actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-3 bg-white text-gray-900 rounded-full hover:bg-blue-600 hover:text-white transition transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md font-medium"
            title="Visualizar detalhes"
          >
            <Eye className="h-5 w-5" />
          </button>
          
          {product.stock > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCartDirectly(product);
              }}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 shadow-md font-medium"
              title="Adicionar ao carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Details Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Category metadata */}
        <span className="text-[10px] font-bold font-mono tracking-wider text-blue-600 uppercase mb-1">
          {product.category === 'camisas' && 'Camisas de Time'}
          {product.category === 'chuteiras' && 'Chuteiras'}
          {product.category === 'agasalhos' && 'Agasalhos e Casacos'}
          {product.category === 'acessorios' && 'Pesos e Acessórios'}
        </span>

        {/* Product Name */}
        <h3 
          onClick={() => onSelect(product)}
          className="font-sans font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 hover:text-blue-600 cursor-pointer transition mb-2 min-h-[40px]"
        >
          {product.name}
        </h3>

        {/* Price Tag with discount calculation if any */}
        <div className="mt-auto pt-3 flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-extrabold text-gray-900">
            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {product.oldPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* Dynamic Shipping Estimation badge */}
        <span className="text-[11px] text-gray-400 mt-1 flex items-center">
          Frete fixo de R$ {product.freight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>

        {/* View Details/Add Button on Mobile (No hover action accessible) */}
        <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
          <button
            onClick={() => onSelect(product)}
            className="py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
          >
            Detalhes
          </button>
          {product.stock > 0 ? (
            <button
              onClick={() => onAddToCartDirectly(product)}
              className="py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-1 shadow-sm"
            >
              Comprar
            </button>
          ) : (
            <span className="py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-lg text-center">
              Faltando
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
