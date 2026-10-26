'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {
    ArrowDownRight,
    ArrowRight,
    Building2,
    Check,
    ChevronDown,
    Clock3,
    MapPin,
    Phone,
    Search,
} from 'lucide-react';


import './services.css';
import {YMAP_MAP_KEY} from "@/config";
import {contacts} from "@/lib/site";

interface Contact {
    city: string;
    address: string;
    phones: string[];
    coords: [number, number];
}

interface YandexMap {
    geoObjects: {
        add: (object: unknown) => void;
        removeAll: () => void;
    };

    setCenter: (
        center: [number, number],
        zoom?: number,
        options?: Record<string, unknown>,
    ) => void;

    destroy: () => void;
}

interface YandexMapsApi {
    ready: (callback: () => void) => void;

    Map: new (
        element: HTMLElement,
        options: Record<string, unknown>,
    ) => YandexMap;

    Placemark: new (
        coordinates: [number, number],
        properties?: Record<string, unknown>,
        options?: Record<string, unknown>,
    ) => unknown;
}

declare global {
    interface Window {
        ymaps?: YandexMapsApi;
    }
}

const ALL_CITIES = 'Все';

const MAP_CENTER: [number, number] = [40.7, 72.8];

const services: Contact[] = [
    {
        city: 'Бишкек',
        address: 'ул. Осмонкула 186',
        phones: ['0505896306', '0555896306'],
        coords: [42.887689, 74.628171],
    },
    {
        city: 'Г.Кара балта-Г.Каракол-Г.Нарын-Г.Токмок-Г.Балыкчы-Г.Талас',
        address: 'ул. Осмонкула 186',
        phones: ['0505896306', '0555896306'],
        coords: [42.887689, 74.628171],
    },
    {
        city: 'Ош',
        address: 'ул. Аскар Шакиров 161',
        phones: ['0550005153', '996322241515'],
        coords: [40.522234, 72.810592],
    },
    {
        city: 'Джалал Абад',
        address: 'ул. Малашов 19 (по ремонту белой техники)',
        phones: ['0999547443', '0704737220'],
        coords: [41.152260, 73.309929],
    },
    {
        city: 'Узген',
        address: 'ул. Бегалдиев 1',
        phones: ['0557778100'],
        coords: [40.7694, 73.3],
    },
    {
        city: 'Кызыл-Кыя',
        address: 'с. Уч Коргон, Мамасиваев 2',
        phones: ['0773200892', '0774786000'],
        coords: [40.25, 72.1167],
    },
    {
        city: 'Араван',
        address: 'ул. Хабиб Абдуллаева 74/1',
        phones: ['0557258783', '0556890028'],
        coords: [40.506843, 72.504491],
    },
    {
        city: 'Ноокат',
        address: 'ул. Ошская 71',
        phones: ['0554201636', '0551955516'],
        coords: [40.2667, 72.6167],
    },
    {
        city: 'Баткен',
        address: 'ул. Илимбек Мурзаев №2',
        phones: ['0776250091'],
        coords: [40.060518, 70.819638],
    },
    {
        city: 'Базар-Кургон',
        address: 'Ориентир школа Бокомбаева',
        phones: ['0551066560'],
        coords: [41.068678, 72.644019],
    },
    {
        city: 'Таш-Көмүр',
        address: 'ул. Какелеев 17/4',
        phones: ['0998191009', '0777565756'],
        coords: [41.346660, 72.225806],
    },
];
let yandexMapsPromise: Promise<YandexMapsApi> | null = null;

function loadYandexMaps(apiKey: string): Promise<YandexMapsApi> {
    if (typeof window !== 'undefined' && window.ymaps) {
        return Promise.resolve(window.ymaps);
    }

    if (yandexMapsPromise) {
        return yandexMapsPromise;
    }

    yandexMapsPromise = new Promise<YandexMapsApi>((resolve, reject) => {
        let script = document.querySelector<HTMLScriptElement>(
            'script[data-levo-yandex-maps]'
        );

        const handleLoad = () => {
            if (window.ymaps) {
                resolve(window.ymaps);
            } else {
                reject(new Error('Yandex Maps API не найден после загрузки'));
            }
        };

        const handleError = () => {
            reject(new Error('Не удалось загрузить Yandex Maps API'));
        };

        if (script) {
            script.addEventListener('load', handleLoad, { once: true });
            script.addEventListener('error', handleError, { once: true });
            return;
        }

        script = document.createElement('script');
        script.dataset.levoYandexMaps = 'true';
        script.src =
            `https://api-maps.yandex.ru/2.1/?apikey=` +
            `${encodeURIComponent(apiKey)}&lang=ru_RU`;
        script.async = true;

        script.addEventListener('load', handleLoad, { once: true });
        script.addEventListener('error', handleError, { once: true });

        document.head.appendChild(script);
    }).catch((error: unknown) => {
        yandexMapsPromise = null;
        throw error;
    });

    return yandexMapsPromise;
}


export default function servicesPage() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<YandexMap | null>(null);
    const mapApi = useRef<YandexMapsApi | null>(null);

    const [selectedCity, setSelectedCity] = useState(ALL_CITIES);
    const [mapReady, setMapReady] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [citySearch, setCitySearch] = useState('');
    const cityDropdownRef = useRef<HTMLDivElement>(null);


    const filteredservices =
        selectedCity === ALL_CITIES
            ? services
            : services.filter((contact) => contact.city === selectedCity);

    const renderMarkers = useCallback((list: Contact[]) => {
        const map = mapInstance.current;
        const ymaps = mapApi.current;

        if (!map || !ymaps) {
            return;
        }

        map.geoObjects.removeAll();

        list.forEach((contact) => {
            const placemark = new ymaps.Placemark(
                contact.coords,
                {
                    balloonContent: `
            <div style="padding: 10px; font-family: Arial, sans-serif;">
                <strong>${contact.city}</strong>
            <p style="margin-top: 8px;">${contact.address}</p>
            ${contact.phones
                        .map(
                            (phone) =>
                                `<p style="margin-top: 5px;">${phone}</p>`,
                        )
                        .join('')}
                </div>
                `,
                    hintContent: contact.city,
                },
                {
                    preset: 'islands#blackDotIcon',
                },
            );

            map.geoObjects.add(placemark);
        });
    }, []);
    const cityOptions = [
        ALL_CITIES,
        ...services.map((contact) => contact.city),
    ];

    const filteredCityOptions = cityOptions.filter((city) =>
        (city === ALL_CITIES ? 'Все города' : city)
            .toLocaleLowerCase('ru')
            .includes(citySearch.trim().toLocaleLowerCase('ru')),
    );

    useEffect(() => {
        if (!cityDropdownOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (
                cityDropdownRef.current &&
                !cityDropdownRef.current.contains(event.target as Node)
            ) {
                setCityDropdownOpen(false);
                setCitySearch('');
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setCityDropdownOpen(false);
                setCitySearch('');
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [cityDropdownOpen]);
    useEffect(() => {

        let cancelled = false;

        void loadYandexMaps(YMAP_MAP_KEY)
            .then((ymaps) => {
                if (cancelled || !mapRef.current || mapInstance.current) {
                    return;
                }

                mapApi.current = ymaps;

                ymaps.ready(() => {
                    if (cancelled || !mapRef.current || mapInstance.current) {
                        return;
                    }

                    try {
                        const map = new ymaps.Map(mapRef.current, {
                            center: MAP_CENTER,
                            zoom: 8,
                            controls: ['zoomControl'],
                        });

                        mapInstance.current = map;
                        renderMarkers(services);
                        setMapReady(true);
                        setMapError(false);
                    } catch (error) {
                        console.error('Ошибка инициализации Яндекс Карт:', error);
                        setMapError(true);
                    }
                });
            })
            .catch((error: unknown) => {
                if (!cancelled) {
                    console.error('Ошибка загрузки Яндекс Карт:', error);
                    setMapError(true);
                }
            });

        return () => {
            cancelled = true;

            mapInstance.current?.destroy();
            mapInstance.current = null;
            mapApi.current = null;
        };
    }, [renderMarkers]);

// Обновление маркеров и центра при выборе города
    useEffect(() => {
        if (!mapReady || !mapInstance.current) {
            return;
        }

        renderMarkers(filteredservices);

        if (selectedCity === ALL_CITIES) {
            mapInstance.current.setCenter(MAP_CENTER, 8);
            return;
        }

        const selectedContact = services.find(
            (contact) => contact.city === selectedCity,
        );

        if (selectedContact) {
            mapInstance.current.setCenter(selectedContact.coords, 12);
        }
    }, [selectedCity, mapReady, renderMarkers]);

    const selectCity = (city: string) => {
        setSelectedCity(city);

        if (city === ALL_CITIES) {
            return;
        }

        const contact = services.find((item) => item.city === city);

        if (contact && mapInstance.current) {
            mapInstance.current.setCenter(contact.coords, 12);
        }
    };

    return (
        <>
            <main className="services-page">
                {/* Первый экран */}
                <section className="services-intro">
                    <div className="services-container">
                        <div className="services-eyebrow">
                            <span className="services-eyebrow-line"/>
                            <span>LEVO · СЕРВИС И ПОДДЕРЖКА</span>
                        </div>

                        <div className="services-hero-grid">
                            <h1 className="services-main-title">
                                Мы всегда
                                <br/>
                                <span>рядом.</span>
                            </h1>

                            <div className="services-intro-description">
                                <p>
                                    Найдите ближайший сервисный центр LEVO.
                                    Наши специалисты готовы помочь с обслуживанием
                                    и ремонтом вашей техники.
                                </p>

                                <a href="#service-centers" className="services-text-link">
                                    Найти сервисный центр
                                    <ArrowDownRight size={17} strokeWidth={1.5}/>
                                </a>
                            </div>
                        </div>

                        <div className="services-stats">
                            <div className="services-stat">
                <span className="services-stat-value">
                  {String(services.length).padStart(2, '0')}
                </span>
                                <span className="services-stat-label">
                  Контактных точек
                </span>
                            </div>

                            <div className="services-stat">
                                <span className="services-stat-value">KG</span>
                                <span className="services-stat-label">
                  По Кыргызстану
                </span>
                            </div>

                            <div className="services-stat services-stat-desktop">
                <span className="services-stat-value services-stat-brand">
                  <span className="services-status-dot"/>
                  LEVO
                </span>
                                <span className="services-stat-label">
                  Сервисная поддержка
                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Карточки сервисных центров */}
                <section id="service-centers" className="services-centers">
                    <div className="services-container">
                        <div className="services-section-heading">
                            <div>
                <span className="services-section-eyebrow">
                  НАШИ АДРЕСА
                </span>

                                <h2 className="services-section-title">
                                    Сервисные центры
                                </h2>
                            </div>


                            <div className="services-filter">
                                <label id="city-filter-label">Выберите город</label>

                                <div className="city-dropdown" ref={cityDropdownRef}>
                                    <button
                                        type="button"
                                        className={`city-dropdown-trigger ${
                                            cityDropdownOpen ? 'is-open' : ''
                                        }`}
                                        aria-labelledby="city-filter-label"
                                        aria-haspopup="listbox"
                                        aria-expanded={cityDropdownOpen}
                                        onClick={() => setCityDropdownOpen((open) => !open)}
                                    >
            <span className="city-dropdown-value">
                {selectedCity === ALL_CITIES
                    ? 'Все города'
                    : selectedCity}
            </span>

                                        <ChevronDown
                                            size={17}
                                            strokeWidth={1.5}
                                            className="city-dropdown-chevron"
                                        />
                                    </button>

                                    {cityDropdownOpen && (
                                        <div className="city-dropdown-menu">
                                            <div className="city-dropdown-search">
                                                <Search size={16} strokeWidth={1.6}/>

                                                <input
                                                    type="text"
                                                    value={citySearch}
                                                    onChange={(event) =>
                                                        setCitySearch(event.target.value)
                                                    }
                                                    placeholder="Найти город..."
                                                    aria-label="Поиск города"
                                                    autoFocus
                                                />
                                            </div>

                                            <div
                                                className="city-dropdown-options"
                                                role="listbox"
                                                aria-label="Города"
                                            >
                                                {filteredCityOptions.map((city) => {
                                                    const isSelected = selectedCity === city;

                                                    return (
                                                        <button
                                                            type="button"
                                                            role="option"
                                                            aria-selected={isSelected}
                                                            key={city}
                                                            className={`city-dropdown-option ${
                                                                isSelected ? 'is-selected' : ''
                                                            }`}
                                                            onClick={() => {
                                                                selectCity(city);
                                                                setCityDropdownOpen(false);
                                                                setCitySearch('');
                                                            }}
                                                        >
                                <span>
                                    {city === ALL_CITIES
                                        ? 'Все города'
                                        : city}
                                </span>

                                                            {isSelected && (
                                                                <Check
                                                                    size={16}
                                                                    strokeWidth={1.8}
                                                                />
                                                            )}
                                                        </button>
                                                    );
                                                })}

                                                {filteredCityOptions.length === 0 && (
                                                    <p className="city-dropdown-empty">
                                                        Город не найден
                                                    </p>
                                                )}
                                            </div>

                                            <div className="city-dropdown-footer">
                                                {filteredCityOptions.length} вариантов
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        <div className="services-results">
              <span>
                {selectedCity === ALL_CITIES
                    ? 'Все направления'
                    : selectedCity}
              </span>

                            <span>
                {filteredservices.length} из {services.length}
              </span>
                        </div>

                        <div className="services-grid">
                            {filteredservices.map((contact, index) => (
                                <article
                                    key={contact.city}
                                    className="services-card"
                                    onClick={() => selectCity(contact.city)}
                                >
                                    <div className="services-card-top">
                    <span className="services-card-number">
                      SERVICE / {String(index + 1).padStart(2, '0')}
                    </span>

                                        <Building2
                                            className="services-card-icon"
                                            size={20}
                                            strokeWidth={1.3}
                                        />
                                    </div>

                                    <div className="services-card-main">
                                        <h3>{contact.city}</h3>

                                        <div className="services-address">
                                            <MapPin size={17} strokeWidth={1.4}/>

                                            <p>{contact.address}</p>
                                        </div>
                                    </div>

                                    <div className="services-card-bottom">
                    <span className="services-card-caption">
                      СВЯЗАТЬСЯ С НАМИ
                    </span>

                                        <div className="services-phones">
                                            {contact.phones.map((phone) => (
                                                <a
                                                    key={phone}
                                                    href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                                                    onClick={(event) => event.stopPropagation()}
                                                >
                                                    <Phone size={15} strokeWidth={1.5}/>
                                                    <span>{phone}</span>
                                                </a>
                                            ))}
                                        </div>

                                        <div className="services-card-footer">
                                            <span>Посмотреть на карте</span>

                                            <ArrowRight
                                                size={17}
                                                strokeWidth={1.4}
                                                className="services-card-arrow"
                                            />
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Карта */}
                <section className="services-map-section">
                    <div className="services-container">
                        <div className="services-map-heading">
                            <div>
                <span className="services-section-eyebrow">
                  ГЕОГРАФИЯ LEVO
                </span>

                                <h2 className="services-section-title">
                                    Найдите нас
                                </h2>
                            </div>

                            <p>
                                Выберите город в списке или нажмите на карточку,
                                чтобы перейти к нужной точке на карте.
                            </p>
                        </div>

                        <div className="services-map-wrapper">
                            <div
                                ref={mapRef}
                                className="services-map"
                                role="application"
                                aria-label="Карта сервисных центров LEVO"
                            />

                            {!mapReady && !mapError && (
                                <div className="services-map-overlay">
                                    <MapPin size={25} strokeWidth={1.3}/>

                                    <p>Загружаем карту</p>
                                </div>
                            )}

                            {mapError && (
                                <div className="services-map-overlay">
                                    <MapPin size={28} strokeWidth={1.3}/>

                                    <p>Карта временно недоступна</p>

                                    <span>
                    Проверьте интернет-соединение и API-ключ Яндекс Карт.
                  </span>
                                </div>
                            )}
                        </div>

                        <div className="services-map-bottom">
                            <div className="services-map-note">
                                <Clock3 size={16} strokeWidth={1.4}/>

                                <span>
                  Контактные данные сервисных центров
                </span>
                            </div>

                            <a href={`tel:${contacts.phone}`} className="services-text-link">
                                Связаться с LEVO
                                <ArrowRight size={16} strokeWidth={1.5}/>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Финальный блок */}
                <section className="services-cta">
                    <div className="services-container services-cta-inner">
                        <div>
              <span className="services-cta-eyebrow">
                LEVO · ЗАБОТА О ВАШЕЙ ТЕХНИКЕ
              </span>

                            <h2>
                                Технологии должны
                                <br/>
                                работать на вас.
                            </h2>
                        </div>

                        <a href={`tel:${contacts.phone}`} className="services-cta-link">
                            Позвонить нам
                            <ArrowRight size={18} strokeWidth={1.5}/>
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
}