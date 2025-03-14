'use client';

import { useLocalStorage } from 'usehooks-ts';
import { Button } from '@/libs/ui/components/ui/button';
import { Toaster } from '@/libs/ui/components/ui/sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/libs/ui/components/ui/card';
import { Checkbox } from '@/libs/ui/components/ui/checkbox';
import { Input } from '@/libs/ui/components/ui/input';
import { Label } from '@/libs/ui/components/ui/label';
import { Separator } from '@/libs/ui/components/ui/separator';
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Define the locales object with all required translations
const locales = {
  calculatorTitle: 'IMEI Tax Calculator',
  priceInSgdLabel: 'Price (SGD)',
  priceInUsdLabel: 'Price (USD)',
  priceInIdrLabel: 'Price (IDR)',
  usdToSgdRateLabel: 'USD to SGD Rate',
  usdToIdrRateLabel: 'USD to IDR Rate',
  bufferSgdLabel: 'Buffer (SGD)',
  bufferUsdLabel: 'Buffer (USD)',
  bufferIdrLabel: 'Buffer (IDR)',
  taxRelieveLabel: 'Tax Relieve',
  priceAfterTaxRelieveLabel: 'Price after Tax Relieve',
  pphAmountLabel: 'PPh Amount',
  importPriceLabel: 'Import Price',
  customImportTaxLabel: 'Custom Import Tax',
  ppnAmountLabel: 'PPN Amount',
  pph22AmountLabel: 'PPh22 Amount',
  totalTaxAmountLabel: 'Total Tax Amount',
  totalPriceWithBufferLabel: 'Total Price with Buffer',
  equivalentToIdr: 'Equivalent to IDR',
  atRate: 'at USD/IDR rate:',
  currencySelection: 'Display Tax Calculation in:',
  sgdLabel: 'SGD',
  usdLabel: 'USD',
  idrLabel: 'IDR',
  'exchangeRate.sync.successMessage':
    "Exchange Rate is updated to today's rate.",
  'exchangeRate.sync.failedMessage':
    'Failed to update exchange rate. Please try again!',
};

// Define the translation function
const t = (key: keyof typeof locales) => {
  return locales[key] || key;
};

type Currency = 'SGD' | 'USD' | 'IDR';

interface TaxCalculationProps {
  priceUSD: number;
  taxRelieve: number;
  buffer: number;
  usdToSgdRate: number;
  usdToIdrRate: number;
  selectedCurrency: Currency;
}

const TaxCalculation = ({
  priceUSD,
  taxRelieve,
  buffer,
  usdToSgdRate,
  usdToIdrRate,
  selectedCurrency,
}: TaxCalculationProps) => {
  // State variables for calculated values
  const [priceAfterTaxRelieve, setPriceAfterTaxRelieve] = useState(0);
  const [pphAmount, setPphAmount] = useState(0);
  const [importPrice, setImportPrice] = useState(0);
  const [customImportTaxAmount, setCustomImportTaxAmount] = useState(0);
  const [ppnAmount, setPpnAmount] = useState(0);
  const [pph22Amount, setPph22Amount] = useState(0);
  const [totalTaxAmount, setTotalTaxAmount] = useState(0);
  const [totalPriceWithBuffer, setTotalPriceWithBuffer] = useState(0);

  // Helper function to convert and format values based on selected currency
  const convertValue = (value: number): string => {
    if (selectedCurrency === 'SGD') {
      return value * usdToSgdRate;
    } else if (selectedCurrency === 'IDR') {
      return value * usdToIdrRate;
    } else {
      return value;
    }
  };

  // Helper function to get currency suffix
  const getCurrencySuffix = (): string => {
    return selectedCurrency;
  };

  // Update calculations when inputs change
  useEffect(() => {
    // Calculate Price after Tax Relieve
    const afterRelieve = Math.max(priceUSD - taxRelieve, 0);
    setPriceAfterTaxRelieve(afterRelieve);

    // Calculate PPhAmount (10% of price after tax relieve)
    const pphAmt = afterRelieve * 0.1;
    setPphAmount(pphAmt);

    // Calculate Import Price
    const importPrc = afterRelieve + pphAmt;
    setImportPrice(importPrc);

    // Calculate Custom Import Tax Amount (10% of price after tax relieve)
    const customTax = afterRelieve * 0.1;
    setCustomImportTaxAmount(customTax);

    // Calculate PPN Amount (11% of import price)
    const ppn = importPrc * 0.11;
    setPpnAmount(ppn);

    // Calculate PPh22 Amount (10% of import price)
    const pph22 = importPrc * 0.1;
    setPph22Amount(pph22);

    // Calculate Total Tax Amount
    const totalTax = customTax + ppn + pph22;
    setTotalTaxAmount(totalTax);

    // Calculate Total Price with Buffer (in USD)
    const bufferInUSD =
      selectedCurrency === 'SGD'
        ? buffer / usdToSgdRate
        : selectedCurrency === 'IDR'
          ? buffer / usdToIdrRate
          : buffer;
    const totalWithBuffer = priceUSD + totalTax + bufferInUSD;
    setTotalPriceWithBuffer(totalWithBuffer);
  }, [
    priceUSD,
    taxRelieve,
    buffer,
    selectedCurrency,
    usdToSgdRate,
    usdToIdrRate,
  ]);

  return (
    <>
      {/* Tax Relief section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{`${t('taxRelieveLabel')} (${getCurrencySuffix()})`}</Label>
          <Input readOnly disabled value={convertValue(taxRelieve)} />
        </div>
        <div className="space-y-2">
          <Label>{`${t(
            'priceAfterTaxRelieveLabel'
          )} (${getCurrencySuffix()})`}</Label>
          <Input readOnly disabled value={convertValue(priceAfterTaxRelieve)} />
        </div>
      </div>

      <Separator />

      {/* Tax calculations section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pphAmount">{`${t(
              'pphAmountLabel'
            )} (${getCurrencySuffix()})`}</Label>
            <Input
              id="pphAmount"
              readOnly
              disabled
              value={convertValue(pphAmount)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="importPrice">{`${t(
              'importPriceLabel'
            )} (${getCurrencySuffix()})`}</Label>
            <Input
              id="importPrice"
              readOnly
              disabled
              value={convertValue(importPrice)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customImportTaxAmount">{`${t(
              'customImportTaxLabel'
            )} (${getCurrencySuffix()})`}</Label>
            <Input
              id="customImportTaxAmount"
              readOnly
              disabled
              value={convertValue(customImportTaxAmount)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ppnAmount">{`${t(
              'ppnAmountLabel'
            )} (${getCurrencySuffix()})`}</Label>
            <Input
              id="ppnAmount"
              readOnly
              disabled
              value={convertValue(ppnAmount)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pph22Amount">{`${t(
              'pph22AmountLabel'
            )} (${getCurrencySuffix()})`}</Label>
            <Input
              id="pph22Amount"
              readOnly
              disabled
              value={convertValue(pph22Amount)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalTaxAmount">{`${t(
              'totalTaxAmountLabel'
            )} (${getCurrencySuffix()})`}</Label>
            <Input
              id="totalTaxAmount"
              readOnly
              disabled
              value={convertValue(totalTaxAmount)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Final price section */}
      <div className="space-y-2">
        <Label htmlFor="totalPriceWithBuffer">{`${t(
          'totalPriceWithBufferLabel'
        )} (${getCurrencySuffix()})`}</Label>
        <Input
          id="totalPriceWithBuffer"
          readOnly
          disabled
          value={convertValue(totalPriceWithBuffer)}
          className="text-lg font-bold"
        />
      </div>

      {/* IDR equivalent - show only if not already in IDR */}
      {selectedCurrency !== 'IDR' && (
        <div className="pt-2">
          <p className="text-right text-sm text-gray-500">
            {t('equivalentToIdr')}{' '}
            {(totalPriceWithBuffer * usdToIdrRate).toLocaleString()}(
            {t('atRate')} {usdToIdrRate.toLocaleString()})
          </p>
        </div>
      )}
    </>
  );
};

const IMEITaxCalculator = () => {
  // State variables for inputs
  const [priceSGD, setPriceSGD] = useLocalStorage(
    'calculator-imei:priceSGD',
    1000
  );
  const [priceUSD, setPriceUSD] = useLocalStorage(
    'calculator-imei:priceUSD',
    750
  );
  const [priceIDR, setPriceIDR] = useLocalStorage(
    'calculator-imei:priceIDR',
    11250000
  );
  const [bufferSGD, setBufferSGD] = useLocalStorage(
    'calculator-imei:bufferSGD',
    66.67
  );
  const [bufferUSD, setBufferUSD] = useLocalStorage(
    'calculator-imei:bufferUSD',
    50
  );
  const [bufferIDR, setBufferIDR] = useLocalStorage(
    'calculator-imei:bufferIDR',
    750000
  );
  const [usdToSgdRate, setUsdToSgdRate] = useLocalStorage(
    'calculator-imei:usdToSgdRate',
    1.33
  );
  const [usdToIdrRate, setUsdToIdrRate] = useLocalStorage(
    'calculator-imei:usdToIdrRate',
    15000
  );
  const [taxRelieve] = useLocalStorage('calculator-imei:taxRelieve', 500);
  const [activeInput, setActiveInput] = useLocalStorage<Currency>(
    'calculator-imei:activeInput',
    'SGD'
  );
  const [activeBufferInput, setActiveBufferInput] = useLocalStorage<Currency>(
    'calculator-imei:activeBufferInput',
    'USD'
  );
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage<Currency>(
    'calculator-imei:selectedCurrency',
    'USD'
  );
  const [isLoading, setLoading] = useState(false);

  // Update price values based on exchange rates when one changes
  const handlePriceChange = (value: number, type: Currency) => {
    setActiveInput(type);

    if (type === 'SGD') {
      setPriceSGD(value);
      const usdValue = value / usdToSgdRate;
      setPriceUSD(usdValue);
      setPriceIDR(usdValue * usdToIdrRate);
    } else if (type === 'USD') {
      setPriceUSD(value);
      setPriceSGD(value * usdToSgdRate);
      setPriceIDR(value * usdToIdrRate);
    } else if (type === 'IDR') {
      setPriceIDR(value);
      const usdValue = value / usdToIdrRate;
      setPriceUSD(usdValue);
      setPriceSGD(usdValue * usdToSgdRate);
    }
  };

  // Update buffer values based on exchange rates when one changes
  const handleBufferChange = (value: number, type: Currency) => {
    setActiveBufferInput(type);

    if (type === 'SGD') {
      setBufferSGD(value);
      const usdValue = value / usdToSgdRate;
      setBufferUSD(usdValue);
      setBufferIDR(usdValue * usdToIdrRate);
    } else if (type === 'USD') {
      setBufferUSD(value);
      setBufferSGD(value * usdToSgdRate);
      setBufferIDR(value * usdToIdrRate);
    } else if (type === 'IDR') {
      setBufferIDR(value);
      const usdValue = value / usdToIdrRate;
      setBufferUSD(usdValue);
      setBufferSGD(usdValue * usdToSgdRate);
    }
  };

  // Update prices when exchange rates change
  useEffect(() => {
    if (activeInput === 'SGD') {
      const usdValue = priceSGD / usdToSgdRate;
      setPriceUSD(usdValue);
      setPriceIDR(usdValue * usdToIdrRate);
    } else if (activeInput === 'USD') {
      setPriceSGD(priceUSD * usdToSgdRate);
      setPriceIDR(priceUSD * usdToIdrRate);
    } else if (activeInput === 'IDR') {
      const usdValue = priceIDR / usdToIdrRate;
      setPriceUSD(usdValue);
      setPriceSGD(usdValue * usdToSgdRate);
    }

    if (activeBufferInput === 'SGD') {
      const usdValue = bufferSGD / usdToSgdRate;
      setBufferUSD(usdValue);
      setBufferIDR(usdValue * usdToIdrRate);
    } else if (activeBufferInput === 'USD') {
      setBufferSGD(bufferUSD * usdToSgdRate);
      setBufferIDR(bufferUSD * usdToIdrRate);
    } else if (activeBufferInput === 'IDR') {
      const usdValue = bufferIDR / usdToIdrRate;
      setBufferUSD(usdValue);
      setBufferSGD(usdValue * usdToSgdRate);
    }
  }, [
    usdToSgdRate,
    usdToIdrRate,
    activeInput,
    priceSGD,
    priceUSD,
    priceIDR,
    activeBufferInput,
    bufferSGD,
    bufferUSD,
    bufferIDR,
  ]);

  // Get the buffer value based on selected currency
  const getBufferForSelectedCurrency = (): number => {
    switch (selectedCurrency) {
      case 'SGD':
        return bufferSGD;
      case 'USD':
        return bufferUSD;
      case 'IDR':
        return bufferIDR;
      default:
        return bufferUSD;
    }
  };

  return (
    <div className="h-full w-full p-4">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">{t('calculatorTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input section with multiple currencies */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="priceSGD">{t('priceInSgdLabel')}</Label>
                <Input
                  id="priceSGD"
                  type="number"
                  value={priceSGD}
                  onChange={(e) =>
                    handlePriceChange(parseFloat(e.target.value) || 0, 'SGD')
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceUSD">{t('priceInUsdLabel')}</Label>
                <Input
                  id="priceUSD"
                  type="number"
                  value={priceUSD}
                  onChange={(e) =>
                    handlePriceChange(parseFloat(e.target.value) || 0, 'USD')
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceIDR">{t('priceInIdrLabel')}</Label>
                <Input
                  id="priceIDR"
                  type="number"
                  value={priceIDR}
                  onChange={(e) =>
                    handlePriceChange(parseFloat(e.target.value) || 0, 'IDR')
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="bufferSGD">{t('bufferSgdLabel')}</Label>
                <Input
                  id="bufferSGD"
                  type="number"
                  value={bufferSGD}
                  onChange={(e) =>
                    handleBufferChange(parseFloat(e.target.value) || 0, 'SGD')
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bufferUSD">{t('bufferUsdLabel')}</Label>
                <Input
                  id="bufferUSD"
                  type="number"
                  value={bufferUSD}
                  onChange={(e) =>
                    handleBufferChange(parseFloat(e.target.value) || 0, 'USD')
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bufferIDR">{t('bufferIdrLabel')}</Label>
                <Input
                  id="bufferIDR"
                  type="number"
                  value={bufferIDR}
                  onChange={(e) =>
                    handleBufferChange(parseFloat(e.target.value) || 0, 'IDR')
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="usdToSgdRate">{t('usdToSgdRateLabel')}</Label>
                <Input
                  id="usdToSgdRate"
                  type="number"
                  step="0.01"
                  value={usdToSgdRate}
                  onChange={(e) =>
                    setUsdToSgdRate(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usdToIdrRate">{t('usdToIdrRateLabel')}</Label>
                <Input
                  id="usdToIdrRate"
                  type="number"
                  value={usdToIdrRate}
                  onChange={(e) =>
                    setUsdToIdrRate(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="col-span-full flex justify-center space-y-2">
                <Button
                  id="refreshRate"
                  disabled={isLoading}
                  onClick={async (e) => {
                    try {
                      setLoading(true);
                      const resp = await fetch(
                        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
                      )
                        .then((i) => {
                          toast(`✅ ${t('exchangeRate.sync.successMessage')}`);
                          return i.json();
                        })
                        .catch(() =>
                          toast(`❌ ${t('exchangeRate.sync.failedMessage')}`)
                        )
                        .finally(() => setLoading(false));

                      setUsdToIdrRate(resp.usd.idr);
                      setUsdToSgdRate(resp.usd.sgd);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  {isLoading && <Loader2 className="animate-spin" />}
                  Refresh Rate
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Currency Selection for Tax Calculation */}
          <div className="space-y-2">
            <div className="text-sm font-medium">{t('currencySelection')}</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sgdCheckbox"
                  checked={selectedCurrency === 'SGD'}
                  onCheckedChange={() => setSelectedCurrency('SGD')}
                />
                <Label
                  htmlFor="sgdCheckbox"
                  className="cursor-pointer text-sm font-normal"
                >
                  {t('sgdLabel')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usdCheckbox"
                  checked={selectedCurrency === 'USD'}
                  onCheckedChange={() => setSelectedCurrency('USD')}
                />
                <Label
                  htmlFor="usdCheckbox"
                  className="cursor-pointer text-sm font-normal"
                >
                  {t('usdLabel')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="idrCheckbox"
                  checked={selectedCurrency === 'IDR'}
                  onCheckedChange={() => setSelectedCurrency('IDR')}
                />
                <Label
                  htmlFor="idrCheckbox"
                  className="cursor-pointer text-sm font-normal"
                >
                  {t('idrLabel')}
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tax Calculation Component */}
          <TaxCalculation
            priceUSD={priceUSD}
            taxRelieve={taxRelieve}
            buffer={getBufferForSelectedCurrency()}
            usdToSgdRate={usdToSgdRate}
            usdToIdrRate={usdToIdrRate}
            selectedCurrency={selectedCurrency}
          />
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default IMEITaxCalculator;
