import React from 'react';

type Dividend = {
  date: string;
  amount: number;
};

type Bond = {
  name: string;
  price: number;
  commission: number;
  redemptionAmount: number;
  redemptionDate: string;
  dividends: Dividend[];
};

type ReturnCalculation = {
  totalInvestment: number;
  totalDividends: number;
  reinvestIncome: number;
  totalReceived: number;
  profit: number;
  totalReturn: number;
  annualReturn: number;
  yearsTotal: number;
};

type BondResult = {
  bond: Bond;
  withoutReinvest: ReturnCalculation;
  withReinvest: ReturnCalculation;
};

type ResultsProps = {
  results: BondResult[];
  reinvestRate: number;
  formatNumber: (num: number) => string;
  formatDate: (dateStr: string) => string;
};

export const Results: React.FC<ResultsProps> = ({
  results,
  reinvestRate,
  formatNumber,
  formatDate,
}) => {
  return (
    <>
      {results.map((result, idx) => {
        const bond = result.bond;
        const noReinv = result.withoutReinvest;
        const withReinv = result.withReinvest;

        return (
          <div key={idx} className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">{bond.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">Базові параметри</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ціна покупки:</span>
                    <span className="font-semibold">{formatNumber(bond.price)} грн</span>
                  </div>
                  {bond.commission > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Комісія:</span>
                      <span className="font-semibold text-red-600">{formatNumber(bond.commission)} грн</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Всього інвестиція:</span>
                    <span className="font-bold">{formatNumber(noReinv.totalInvestment)} грн</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дата погашення:</span>
                    <span className="font-semibold">{formatDate(bond.redemptionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Термін:</span>
                    <span className="font-semibold">{noReinv.yearsTotal.toFixed(2)} років</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Сума погашення:</span>
                    <span className="font-semibold">{formatNumber(bond.redemptionAmount)} грн</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">Дивіденди ({bond.dividends.length} виплат)</h3>
                <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                  {bond.dividends.map((div, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600">{formatDate(div.date)}:</span>
                      <span className="font-semibold text-blue-600">{formatNumber(div.amount)} грн</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Всього дивідендів:</span>
                    <span className="font-bold text-blue-600">{formatNumber(noReinv.totalDividends)} грн</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border-2 border-gray-200">
                <h3 className="font-bold text-lg text-gray-800 mb-4">БЕЗ реінвестування</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Всього отримаєте:</span>
                    <span className="font-semibold">{formatNumber(noReinv.totalReceived)} грн</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Прибуток:</span>
                    <span className="font-semibold text-green-600">{formatNumber(noReinv.profit)} грн</span>
                  </div>
                  <div className="border-t-2 pt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-medium">Дохідність:</span>
                      <span className="font-bold text-xl text-gray-800">{noReinv.totalReturn.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">Річна дохідність:</span>
                      <span className="font-bold text-2xl text-indigo-600">{noReinv.annualReturn.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border-2 border-green-300">
                <h3 className="font-bold text-lg text-green-800 mb-4">З реінвестуванням ({reinvestRate}%)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Дохід від реінвестування:</span>
                    <span className="font-semibold text-green-600">+{formatNumber(withReinv.reinvestIncome)} грн</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Всього отримаєте:</span>
                    <span className="font-semibold">{formatNumber(withReinv.totalReceived)} грн</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Прибуток:</span>
                    <span className="font-semibold text-green-600">{formatNumber(withReinv.profit)} грн</span>
                  </div>
                  <div className="border-t-2 border-green-300 pt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-medium">Дохідність:</span>
                      <span className="font-bold text-xl text-green-800">{withReinv.totalReturn.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">Річна дохідність:</span>
                      <span className="font-bold text-2xl text-green-600">{withReinv.annualReturn.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Підсумок: Найкращі варіанти</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur">
            <h3 className="font-bold text-lg mb-3">БЕЗ реінвестування</h3>
            {(() => {
              const best = results.reduce((prev: BondResult, curr: BondResult) =>
                curr.withoutReinvest.annualReturn > prev.withoutReinvest.annualReturn ? curr : prev
              );
              return (
                <div>
                  <div className="text-3xl font-bold mb-2">{best.bond.name}</div>
                  <div className="text-xl">Річна дохідність: {best.withoutReinvest.annualReturn.toFixed(2)}%</div>
                  <div className="text-sm mt-2 opacity-90">Прибуток: {formatNumber(best.withoutReinvest.profit)} грн</div>
                </div>
              );
            })()}
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur">
            <h3 className="font-bold text-lg mb-3">З реінвестуванням</h3>
            {(() => {
              const best = results.reduce((prev: BondResult, curr: BondResult) =>
                curr.withReinvest.annualReturn > prev.withReinvest.annualReturn ? curr : prev
              );
              return (
                <div>
                  <div className="text-3xl font-bold mb-2">{best.bond.name}</div>
                  <div className="text-xl">Річна дохідність: {best.withReinvest.annualReturn.toFixed(2)}%</div>
                  <div className="text-sm mt-2 opacity-90">Прибуток: {formatNumber(best.withReinvest.profit)} грн</div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
          <h3 className="font-semibold mb-2">Порівняння річної дохідності (з реінвестуванням):</h3>
          <div className="space-y-2">
            {results
              .sort((a: BondResult, b: BondResult) => b.withReinvest.annualReturn - a.withReinvest.annualReturn)
              .map((r: BondResult, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="font-medium w-32">{r.bond.name}:</span>
                <div className="flex-1 bg-white bg-opacity-30 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-yellow-300 h-full flex items-center justify-end pr-2"
                    style={{ width: `${(r.withReinvest.annualReturn / 20) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-gray-800">{r.withReinvest.annualReturn.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
