import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, QrCode, FileText, Clipboard, ClipboardCheck, ArrowRight, Smartphone, MapPin } from 'lucide-react';
import { CartItem, OrderAddress, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onSubmitOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: OrderAddress;
    paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto';
  }) => Order;
  onClearCart: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onSubmitOrder,
  onClearCart
}: CheckoutModalProps) {
  // Input fields state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Address state
  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão de Crédito' | 'Boleto'>('PIX');
  
  // Credit card specific state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Success states
  const [finalizedOrder, setFinalizedOrder] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalProductsPrice = cartItems.reduce(
    (sum, item) => sum + (item.product.price * item.quantity),
    0
  );

  const totalFreight = cartItems.reduce(
    (sum, item) => sum + (item.product.freight + (item.quantity - 1) * (item.product.freight * 0.3)),
    0
  );

  const totalSum = totalProductsPrice + totalFreight;

  const handleZipCodeLookup = (cepVal: string) => {
    const numericCep = cepVal.replace(/\D/g, '');
    if (numericCep.length === 8) {
      // Simulate database/API postcode lookup based on standard Brazilian formats
      const citiesByPrefix: { [key: string]: { city: string, state: string, street: string, neighborhood: string } } = {
        '01': { city: 'São Paulo', state: 'SP', street: 'Av. Paulista', neighborhood: 'Bela Vista' },
        '20': { city: 'Rio de Janeiro', state: 'RJ', street: 'Av. NS de Copacabana', neighborhood: 'Copacabana' },
        '30': { city: 'Belo Horizonte', state: 'MG', street: 'Rua da Bahia', neighborhood: 'Centro' },
        '40': { city: 'Salvador', state: 'BA', street: 'Avenida Sete de Setembro', neighborhood: 'Barra' },
        '70': { city: 'Brasília', state: 'DF', street: 'Asa Sul SQS', neighborhood: 'Asa Sul' },
        '80': { city: 'Curitiba', state: 'PR', street: 'Rua XV de Novembro', neighborhood: 'Centro' },
        '90': { city: 'Porto Alegre', state: 'RS', street: 'Avenida Borges de Medeiros', neighborhood: 'Praia de Belas' }
      };

      const prefix = numericCep.substring(0, 2);
      const lookup = citiesByPrefix[prefix] || { city: 'São Paulo', state: 'SP', street: 'Rua Principal Esportiva', neighborhood: 'Bairro Esportivo' };
      
      setStreet(lookup.street);
      setNeighborhood(lookup.neighborhood);
      setCity(lookup.city);
      setState(lookup.state);
    }
  };

  const handlePhoneChange = (val: string) => {
    let clean = val.replace(/\D/g, '');
    if (clean.length > 11) clean = clean.slice(0, 11);
    
    // Format (XX) XXXXX-XXXX
    if (clean.length > 6) {
      val = `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    } else if (clean.length > 2) {
      val = `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    } else if (clean.length > 0) {
      val = `(${clean}`;
    } else {
      val = '';
    }
    setCustomerPhone(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !zipCode || !street || !number || !city || !state) {
      alert('Por favor, preencha todos os campos obrigatórios para o envio.');
      return;
    }

    setSubmitting(true);

    // Simulate online gateway processing delay
    setTimeout(() => {
      const address: OrderAddress = {
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode
      };

      const order = onSubmitOrder({
        customerName,
        customerEmail,
        customerPhone,
        address,
        paymentMethod
      });

      setFinalizedOrder(order);
      setSubmitting(false);
      onClearCart();
    }, 1200);
  };

  const handleCopyPix = () => {
    if (!finalizedOrder) return;
    const pixCode = `00020101021226830014br.gov.bcb.pix2561tarbsports-pixpay-${finalizedOrder.id.toLowerCase()}@pix.com.br5204000053039865405${finalizedOrder.totalSum.toFixed(2)}5802BR5911TARB_SPORTS6009SAO_PAULO62070503***6304CAFE`;
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleCloseSuccess = () => {
    // Reset state & close
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setZipCode('');
    setStreet('');
    setNumber('');
    setNeighborhood('');
    setCity('');
    setState('');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setFinalizedOrder(null);
    onClose();
  };

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < clean.length; i += 4) {
      parts.push(clean.slice(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  const formatCardExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length > 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div 
        id="checkout-modal-content"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[96vh] sm:max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>{finalizedOrder ? 'Pedido Confirmado' : 'Finalizar sua Compra'}</span>
          </h2>
          <button 
            onClick={finalizedOrder ? handleCloseSuccess : onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Success View */}
        {finalizedOrder ? (
          <div className="flex-1 p-5 sm:p-10 flex flex-col items-center text-center max-w-2xl mx-auto overflow-y-auto w-full">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-full mb-5 animate-bounce">
              <CheckCircle className="h-14 w-14" />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2">Pedido Criado com Sucesso!</h3>
            <p className="text-gray-605 text-sm mb-6 leading-relaxed">
              Olá, <span className="font-semibold text-gray-800">{finalizedOrder.customerName}</span>. Seu pedido <span className="font-mono font-bold bg-gray-100 text-emerald-700 px-1.5 py-0.5 rounded-sm">{finalizedOrder.id}</span> foi registrado no nosso banco de dados. Obrigado pela confiança!
            </p>

            {/* If PIX selected, show QR and dynamic parameters */}
            {finalizedOrder.paymentMethod === 'PIX' ? (
              <div className="w-full bg-blue-50/40 border border-blue-100 rounded-2xl p-6 mb-8 text-left space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Mock beautiful QR Code box */}
                  <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-xs flex-shrink-0 flex flex-col items-center">
                    <div className="w-36 h-36 border border-gray-100 bg-gray-50 flex items-center justify-center text-blue-600 rounded-lg">
                      <QrCode className="h-28 w-28 text-blue-600" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-gray-400 mt-2 tracking-widest uppercase">PIX AUTOMÁTICO</span>
                  </div>

                  <div className="space-y-2 flex-grow text-center sm:text-left">
                    <span className="bg-blue-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full inline-block">
                      Aguardando Pagamento
                    </span>
                    <h4 className="font-sans font-bold text-gray-800 text-lg">Pague via Pix de R$ {finalizedOrder.totalSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                    <p className="text-xs text-gray-500">
                      Escaneie o QR Code ao lado utilizando o aplicativo do seu banco ou copie a chave Pix abaixo para pagar sob modalidade copia e cola.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex rounded-lg overflow-hidden border border-blue-200">
                    <input 
                      type="text" 
                      readOnly 
                      value={`00020101021226830014br.gov.bcb.pix2561tarbsports-pixpay-${finalizedOrder.id.toLowerCase()}@pix.com.br520400005303...`}
                      className="bg-white text-[11px] font-mono text-gray-600 flex-1 px-3 py-2.5 outline-none select-all"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 font-bold text-xs uppercase transition flex items-center gap-1 shrink-0"
                    >
                      {copiedPix ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                      <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : finalizedOrder.paymentMethod === 'Boleto' ? (
              <div className="w-full bg-blue-50/40 border border-blue-100 rounded-2xl p-6 mb-8 text-left space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100/65 text-blue-700 p-2.5 rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Boleto Bancário Emitido</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Seu boleto de <span className="font-semibold">R$ {finalizedOrder.totalSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> foi gerado. Os boletos normalmente vencem em 2 dias úteis com liquidações bancárias de até 24 horas.
                    </p>
                    <button
                      onClick={() => alert('Parabéns! O PDF do seu boleto simulado foi aberto em uma nova guia para fins demonstrativos.')}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white font-extrabold text-xs uppercase tracking-wide rounded-lg shadow-xs transition"
                    >
                      Visualizar Boleto PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full bg-purple-50/40 border border-purple-100 rounded-2xl p-6 mb-8 text-left">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 text-purple-700 p-2.5 rounded-xl">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Transação em Processamento</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Sua compra de <span className="font-semibold">R$ {finalizedOrder.totalSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> em 1x no Cartão foi capturada pela adquirente mockada. O status constará em nosso painel administrativo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-2">
              <button
                onClick={() => {
                  const whatsappMessage = `Olá! Acabei de fazer um pedido na Tarb Sports! Pedido ID: ${finalizedOrder.id}, Valor total: R$ ${finalizedOrder.totalSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, Nome: ${finalizedOrder.customerName}. Gostaria de confirmar!`;
                  window.open(`https://wa.me/5531989907000?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition text-center shadow-xs"
              >
                Chamar no WhatsApp
              </button>
              <button
                onClick={handleCloseSuccess}
                className="flex-1 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs uppercase tracking-wider rounded-xl transition text-center"
              >
                Voltar à Loja
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Forms */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
            {/* Left side: inputs */}
            <div className="flex-1 p-4 sm:p-6 space-y-6 md:overflow-y-auto md:max-h-[calc(92vh-140px)] md:pr-4 border-b md:border-b-0 md:border-r border-gray-150">
              {/* Step 1: Personal Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4" />
                  1. Detalhes de Contato
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Marcus Oliveira"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="block w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      WhatsApp / Telefone *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="Ex: (11) 98765-4321"
                      value={customerPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="block w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Seu Endereço de Email *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="Ex: marcus@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="block w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  2. Endereço de Entrega
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      CEP *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: 01310-100"
                      maxLength={9}
                      value={zipCode}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 5) {
                          val = val.slice(0, 5) + '-' + val.slice(5, 8);
                        }
                        setZipCode(val);
                        if (val.replace(/\D/g, '').length === 8) {
                          handleZipCodeLookup(val);
                        }
                      }}
                      className="block w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Endereço (Rua/Avenida) *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Av. Paulista"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="block w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Número *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: 1200"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="block w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Bairro *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Bela Vista"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="block w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                          Cidade *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Cidade"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="block w-full px-2 py-2.5 border border-gray-250 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                          UF *
                        </label>
                        <input
                          required
                          type="text"
                          maxLength={2}
                          placeholder="UF"
                          value={state}
                          onChange={(e) => setState(e.target.value.toUpperCase())}
                          className="block w-full px-2 py-2.5 border border-gray-250 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" />
                  3. Forma de Pagamento
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`p-3.5 flex flex-col items-center gap-2 border rounded-xl font-semibold text-xs transition ${
                      paymentMethod === 'PIX'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-650 hover:bg-gray-50'
                    }`}
                  >
                    <QrCode className="h-5 w-5" />
                    <span>Pix (Rápido)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cartão de Crédito')}
                    className={`p-3.5 flex flex-col items-center gap-2 border rounded-xl font-semibold text-xs transition ${
                      paymentMethod === 'Cartão de Crédito'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-655 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Cartão 1x</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Boleto')}
                    className={`p-3.5 flex flex-col items-center gap-2 border rounded-xl font-semibold text-xs transition ${
                      paymentMethod === 'Boleto'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-655 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Boleto Ativo</span>
                  </button>
                </div>

                {/* Sub-forms nested by method */}
                {paymentMethod === 'Cartão de Crédito' && (
                  <div className="bg-gray-50/50 p-4 border border-gray-150 rounded-xl space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">Titular do Cartão</label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: MARCUS OLIVEIRA SILVA"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className="block w-full mt-1 px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">Número do Cartão</label>
                      <input
                        required
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => formatCardNumber(e.target.value)}
                        className="block w-full mt-1 px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Validade</label>
                        <input
                          required
                          type="text"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => formatCardExpiry(e.target.value)}
                          className="block w-full mt-1 px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Código CVV</label>
                        <input
                          required
                          type="text"
                          maxLength={3}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="block w-full mt-1 px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'PIX' && (
                  <div className="bg-blue-50/25 p-4 border border-blue-100 rounded-xl">
                    <p className="text-[11px] text-blue-800 leading-relaxed font-semibold">
                      ⚡ Pagamento via Pix: O código copia-e-cola e o QR code serão gerados dinamicamente na próxima tela após você clicar em "Finalizar Pedido". Liberação imediata!
                    </p>
                  </div>
                )}

                {paymentMethod === 'Boleto' && (
                  <div className="bg-blue-50/25 p-4 border border-blue-100 rounded-xl">
                    <p className="text-[11px] text-blue-800 leading-relaxed font-semibold">
                      📄 O arquivo PDF do boleto bancário estará disponível para download imediato na tela seguinte. O vencimento será em 2 dias corridos.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Items Overview and pricing */}
            <div className="w-full md:w-80 bg-gray-50 p-4 sm:p-6 flex flex-col justify-between md:overflow-y-auto md:max-h-[calc(92vh-140px)] shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">Resumo da Compra</h3>
                <div className="space-y-4 max-h-[220px] overflow-y-auto mb-4 pr-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-2 text-xs">
                      <img
                        src={item.product.image}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-contain border border-gray-100 bg-white rounded-md flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                        <p className="text-gray-500">Tamanho: {item.selectedSize} ({item.quantity}x)</p>
                      </div>
                      <span className="font-mono font-bold text-gray-800 self-center">
                        R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-650">
                    <span>Produtos ({cartItems.reduce((s,i) => s + i.quantity, 0)})</span>
                    <span className="font-mono">R$ {totalProductsPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-650">
                    <span>Frete Calculado</span>
                    <span className="font-mono">R$ {totalFreight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span className="font-mono text-blue-700 text-base">R$ {totalSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-105 transition flex items-center justify-center gap-1.5"
                >
                  {submitting ? (
                    <span>Processando...</span>
                  ) : (
                    <>
                      <span>Finalizar Pedido</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
