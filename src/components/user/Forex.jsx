import React, { useState, useEffect, useContext } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataContext } from '../../context/DataContext';
import { ForexService } from '../../services/forexService';
import { FOREX_PAIRS } from '../../utils/constants';

const Forex = () => {
    const { createTrade } = useContext(DataContext);
    const [rates, setRates] = useState([]);
    const [selectedPair, setSelectedPair] = useState('EUR/USD');
    const [amount, setAmount] = useState('');
    const [orderType, setOrderType] = useState('buy');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [message, setMessage] = useState(null);

    // Initialize and subscribe to rates
    useEffect(() => {
        // Initial fetch
        ForexService.getRates().then(res => {
            if (res.data) setRates(res.data);
        });

        // Live updates
        const unsubscribe = ForexService.subscribeToRates((newRates) => {
            setRates(() => {
                // Merge updates
                return newRates;
            });

            // Update chart buffer for selected pair
            const currentRate = newRates.find(r => r.pair === selectedPair);
            if (currentRate) {
                setChartData(prev => {
                    const newData = [...prev, { time: new Date().toLocaleTimeString(), price: currentRate.price }];
                    if (newData.length > 20) newData.shift();
                    return newData;
                });
            }
        });

        return () => unsubscribe();
    }, [selectedPair]);

    const currentRate = rates.find(r => r.pair === selectedPair) || { price: 0, change: 0 };
    const getRateColor = (change) => change >= 0 ? 'text-green-500' : 'text-red-500';

    const handleTrade = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        setIsSubmitting(true);
        setMessage(null);

        // Provide a more visually "instant" feedback loop
        setTimeout(() => {
            const result = createTrade({
                type: orderType,
                pair: selectedPair,
                amount: parseFloat(amount),
                price: currentRate.price,
                total: parseFloat(amount) * currentRate.price // Simplified margin calculation
            });

            if (result.success) {
                setMessage({ type: 'success', text: `Successfully ${orderType === 'buy' ? 'bought' : 'sold'} ${amount} lots of ${selectedPair}` });
                setAmount('');
            } else {
                setMessage({ type: 'error', text: result.message });
            }
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Forex Trading</h1>
                    <p className="text-gray-500">Trade major currency pairs with real-time market data.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <Activity className="w-4 h-4" />
                    Market Open
                </div>
            </header>

            {/* Main Trading Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Market List */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-semibold text-gray-700">Markets</h3>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                        {rates.map((rate) => (
                            <div
                                key={rate.pair}
                                onClick={() => {
                                    setSelectedPair(rate.pair);
                                    setChartData([]); // Reset chart
                                }}
                                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center ${selectedPair === rate.pair ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                    }`}
                            >
                                <div>
                                    <div className="font-bold text-gray-900">{rate.pair}</div>
                                    <div className={`text-xs flex items-center gap-1 ${getRateColor(rate.change)}`}>
                                        {rate.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {rate.change > 0 ? '+' : ''}{rate.change}%
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-medium text-gray-900">{rate.price.toFixed(5)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center/Right: Chart & Order Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chart Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    {selectedPair}
                                    <span className="text-2xl text-blue-600 ml-2">{currentRate.price.toFixed(5)}</span>
                                </h2>
                                <p className="text-sm text-gray-500">Live Rate</p>
                            </div>
                            <div className="flex gap-2">
                                {['1H', '4H', '1D', '1W'].map(tf => (
                                    <button key={tf} className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis domain={['auto', 'auto']} orientation="right" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-700 mb-4">Place Order</h3>

                        {message && (
                            <div className={`p-4 mb-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleTrade} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setOrderType('buy')}
                                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${orderType === 'buy' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        BUY
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOrderType('sell')}
                                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${orderType === 'sell' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        SELL
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Lot Size</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                    <span>Required Margin:</span>
                                    <span className="font-medium text-gray-900">${(parseFloat(amount || 0) * currentRate.price / 100).toFixed(2)} (1:100)</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-sm transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' :
                                        orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                                        </span>
                                    ) : (
                                        `${orderType === 'buy' ? 'Buy' : 'Sell'} ${selectedPair}`
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forex;
