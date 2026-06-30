/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresetService, DiagnosticIssue } from '../types';

export const DEFAULT_SERVICES: PresetService[] = [
  // INSTALACIÓN
  {
    id: 'inst_split_std',
    category: 'instalacion',
    concept: 'Instalación Básica Aire Acondicionado Split',
    description: 'Montaje de unidad interior y exterior, hasta 3 metros de línea frigorífica de cobre, aislamiento, cableado de interconexión, manguera de desagüe y soportes estándar.',
    defaultPrice: 220.00
  },
  {
    id: 'inst_multi_split',
    category: 'instalacion',
    concept: 'Instalación Básica Aire Acondicionado Multi-Split 2x1',
    description: 'Instalación de unidad exterior y 2 unidades interiores split, con tirada de hasta 3 metros de tubería por unidad, cableado de comunicación, y pruebas de estanqueidad.',
    defaultPrice: 390.00
  },
  {
    id: 'inst_conductos',
    category: 'instalacion',
    concept: 'Instalación de Aire por Conductos (Centralizado)',
    description: 'Montaje de máquina de conductos en falso techo, conexionado a embocaduras existentes, interconexión de cobre y eléctrica, colocación de termostato básico.',
    defaultPrice: 480.00
  },
  {
    id: 'inst_metro_extra',
    category: 'instalacion',
    concept: 'Línea frigorífica adicional (por metro)',
    description: 'Suministro e instalación de metro lineal adicional de tubería de cobre deshidratado, aislamiento de alta calidad y manguera de interconexión.',
    defaultPrice: 25.00
  },
  {
    id: 'inst_canaleta',
    category: 'instalacion',
    concept: 'Canaleta protectora de PVC (por metro)',
    description: 'Suministro e instalación de canaleta protectora de PVC para ocultar líneas de cobre en exterior/interior.',
    defaultPrice: 12.00
  },
  {
    id: 'inst_bomba_condensados',
    category: 'instalacion',
    concept: 'Bomba de evacuación de condensados',
    description: 'Suministro y colocación de bomba de agua automática para salvar desniveles en la evacuación de condensados de la unidad interior.',
    defaultPrice: 110.00
  },
  {
    id: 'inst_silentblocks',
    category: 'instalacion',
    concept: 'Juego de amortiguadores (Silentblocks) y Soportes',
    description: 'Instalación de soportes reforzados tipo escuadra de exterior con tacos amortiguadores de goma para evitar vibraciones y ruidos.',
    defaultPrice: 45.00
  },

  // LIMPIEZA Y MANTENIMIENTO
  {
    id: 'manten_limpieza_filtros',
    category: 'limpieza',
    concept: 'Mantenimiento Higiénico Estándar (Split)',
    description: 'Desmontaje y lavado químico de filtros, limpieza mecánica de turbina evaporadora, desinfección fúngica/bactericida, y soplado del tubo de desagüe.',
    defaultPrice: 75.00
  },
  {
    id: 'manten_limpieza_condensadora',
    category: 'limpieza',
    concept: 'Limpieza e Inspección de Unidad Exterior',
    description: 'Limpieza de suciedad acumulada en la batería de intercambio de la condensadora exterior con hidrolimpiadora/aire a presión, revisión general de ventilador.',
    defaultPrice: 60.00
  },
  {
    id: 'manten_completo',
    category: 'limpieza',
    concept: 'Mantenimiento Integral Climatizador Doméstico',
    description: 'Limpieza profunda de unidades interior/exterior, desinfección bactericida de batería de evaporación, desatascado de desagüe, comprobación de presiones de gas y consumo.',
    defaultPrice: 110.00
  },

  // REPARACIONES Y AVERÍAS
  {
    id: 'rep_carga_gas_r32',
    category: 'reparacion',
    concept: 'Recarga de Gas Refrigerante Ecológico R32 (Carga básica)',
    description: 'Vaciado del sistema, realización de vacío para eliminar humedad, y carga controlada por peso de hasta 1kg de gas refrigerante R32.',
    defaultPrice: 120.00
  },
  {
    id: 'rep_carga_gas_r410a',
    category: 'reparacion',
    concept: 'Recarga de Gas Refrigerante R410A (Carga básica)',
    description: 'Comprobación de estanqueidad previa, vacío forzado del circuito y recarga controlada por peso de hasta 1kg de gas R410A en el equipo.',
    defaultPrice: 140.00
  },
  {
    id: 'rep_localizar_fuga',
    category: 'reparacion',
    concept: 'Localización de Fuga de Gas con Nitrógeno',
    description: 'Presurización de tuberías con nitrógeno seco a alta presión, comprobación con detector electrónico de fugas o agua jabonosa para ubicar el escape.',
    defaultPrice: 95.00
  },
  {
    id: 'rep_soldadura_cobre',
    category: 'reparacion',
    concept: 'Reparación de Fuga y Soldadura de Plata',
    description: 'Reparación de poro en tubería de cobre mediante soldadura de aleación de plata/cobre, o rehacer abocardados deteriorados en racores.',
    defaultPrice: 65.00
  },
  {
    id: 'rep_capacitor',
    category: 'reparacion',
    concept: 'Sustitución de Condensador de Arranque',
    description: 'Desmontaje de condensadora exterior, testeo con capacímetro y reemplazo de condensador defectuoso del compresor o ventilador exterior (hasta 50uF).',
    defaultPrice: 55.00
  },
  {
    id: 'rep_placa_electronica',
    category: 'reparacion',
    concept: 'Sustitución de Placa Electrónica (Mano de obra)',
    description: 'Desconexión, desmontaje de placa de control principal dañada y montaje de nueva placa de recambio oficial de la marca (repuesto no incluido en tarifa).',
    defaultPrice: 85.00
  },
  {
    id: 'rep_desatasco_desague',
    category: 'reparacion',
    concept: 'Desatasco de Línea de Condensados',
    description: 'Limpieza de lodos y biofilm acumulados en la bandeja o el tubo de condensados por presión de aire/líquido para solucionar desborde de agua.',
    defaultPrice: 50.00
  },

  // MANO DE OBRA Y DESPLAZAMIENTO
  {
    id: 'mo_hora_oficial',
    category: 'mano_obra',
    concept: 'Hora de Mano de Obra Oficial',
    description: 'Tiempo de trabajo del técnico instalador para operaciones generales, reparaciones complejas o diagnósticos in situ.',
    defaultPrice: 40.00
  },
  {
    id: 'mo_desplazamiento',
    category: 'mano_obra',
    concept: 'Desplazamiento Técnico (Radio <20km)',
    description: 'Gastos de viaje y transporte de herramientas y equipo hasta el domicilio o comercio del cliente (dentro del radio urbano de actuación).',
    defaultPrice: 30.00
  },
  {
    id: 'mo_urgencia',
    category: 'mano_obra',
    concept: 'Suplemento por Servicio de Urgencia o Festivo',
    description: 'Suplemento de tarifa por atención telefónica y desplazamiento inmediato fuera del horario laboral estándar o en fines de semana/festivos.',
    defaultPrice: 60.00
  }
];

export const DIAGNOSTIC_GUIDES: DiagnosticIssue[] = [
  {
    id: 'no_enfria',
    symptom: 'No enfría o enfría poco',
    icon: 'Snowflake',
    description: 'La máquina enciende, el ventilador funciona, pero el aire sale a temperatura ambiente o no enfría lo suficiente.',
    checks: [
      '¿Funciona el ventilador exterior? Si no funciona, puede ser el condensador de arranque o la placa electrónica.',
      '¿Las tuberías exteriores tienen escarcha blanca? Indica falta de gas refrigerante (fuga).',
      '¿Están los filtros interiores completamente obstruidos de polvo?',
      '¿El compresor hace ruido de arrancar o se corta enseguida? (Posible protector térmico o condensador).'
    ],
    recommendedSolutions: [
      {
        concept: 'Localización de Fuga de Gas con Nitrógeno',
        description: 'Presurización de tuberías con nitrógeno seco a alta presión, comprobación con detector electrónico de fugas o agua jabonosa para ubicar el escape.',
        price: 95.00,
        category: 'reparacion'
      },
      {
        concept: 'Reparación de Fuga y Soldadura de Plata',
        description: 'Reparación de poro en tubería de cobre mediante soldadura de aleación de plata/cobre, o rehacer abocardados deteriorados en racores.',
        price: 65.00,
        category: 'reparacion'
      },
      {
        concept: 'Recarga de Gas Refrigerante Ecológico R32 (Carga básica)',
        description: 'Vaciado del sistema, realización de vacío para eliminar humedad, y carga controlada por peso de hasta 1kg de gas refrigerante R32.',
        price: 120.00,
        category: 'reparacion'
      },
      {
        concept: 'Sustitución de Condensador de Arranque',
        description: 'Desmontaje de condensadora exterior, testeo con capacímetro y reemplazo de condensador defectuoso del compresor o ventilador exterior (hasta 50uF).',
        price: 55.00,
        category: 'reparacion'
      }
    ]
  },
  {
    id: 'gotea_agua',
    symptom: 'Gotea agua / Se desborda',
    icon: 'Droplet',
    description: 'Cae agua por la unidad interior hacia la pared, humedeciendo la zona o goteando sobre el suelo.',
    checks: [
      '¿Está la bandeja de drenaje interior obstruida por lodo u hongos?',
      '¿Tiene la tubería de desagüe pendiente negativa o sifón incorrecto?',
      '¿El tubo de desagüe exterior está metido en una botella que ya está llena de agua?',
      '¿Se congela la evaporadora por falta de gas y al apagarse gotea?'
    ],
    recommendedSolutions: [
      {
        concept: 'Desatasco de Línea de Condensados',
        description: 'Limpieza de lodos y biofilm acumulados en la bandeja o el tubo de condensados por presión de aire/líquido para solucionar desborde de agua.',
        price: 50.00,
        category: 'reparacion'
      },
      {
        concept: 'Mantenimiento Higiénico Estándar (Split)',
        description: 'Desmontaje y lavado químico de filtros, limpieza mecánica de turbina evaporadora, desinfección fúngica/bactericida, y soplado del tubo de desagüe.',
        price: 75.00,
        category: 'limpieza'
      },
      {
        concept: 'Bomba de evacuación de condensados',
        description: 'Suministro y colocación de bomba de agua automática para salvar desniveles en la evacuación de condensados de la unidad interior.',
        price: 110.00,
        category: 'instalacion'
      }
    ]
  },
  {
    id: 'mal_olor',
    symptom: 'Huele mal al encenderlo',
    icon: 'Wind',
    description: 'El aire sale con un olor desagradable a humedad, podrido, vinagre o alcantarilla de forma inmediata.',
    checks: [
      '¿El desagüe de la máquina está conectado al desagüe de la casa sin sifón independiente?',
      '¿Hay moho u hongos visibles en la turbina cilíndrica de la unidad interior?',
      '¿Están los filtros sucios de grasa o suciedad doméstica acumulada?'
    ],
    recommendedSolutions: [
      {
        concept: 'Mantenimiento Higiénico Estándar (Split)',
        description: 'Desmontaje y lavado químico de filtros, limpieza mecánica de turbina evaporadora, desinfección fúngica/bactericida, y soplado del tubo de desagüe.',
        price: 75.00,
        category: 'limpieza'
      },
      {
        concept: 'Mantenimiento Integral Climatizador Doméstico',
        description: 'Limpieza profunda de unidades interior/exterior, desinfección bactericida de batería de evaporación, desatascado de desagüe, comprobación de presiones de gas y consumo.',
        price: 110.00,
        category: 'limpieza'
      }
    ]
  },
  {
    id: 'ruido_raro',
    symptom: 'Hace mucho ruido o vibra',
    icon: 'Volume2',
    description: 'La unidad exterior vibra con fuerza transmitiendo zumbidos a la vivienda, o la unidad interior chirría.',
    checks: [
      '¿Los soportes exteriores tienen silentblocks de goma colocados y en buen estado (no agrietados)?',
      '¿Hay hojas de árboles o algún objeto tocando las palas del ventilador?',
      '¿La carcasa de plástico de la unidad interior está suelta o mal encajada?',
      '¿El motor de la turbina interior chirría por desgaste de cojinetes?'
    ],
    recommendedSolutions: [
      {
        concept: 'Juego de amortiguadores (Silentblocks) y Soportes',
        description: 'Instalación de soportes reforzados tipo escuadra de exterior con tacos amortiguadores de goma para evitar vibraciones y ruidos.',
        price: 45.00,
        category: 'instalacion'
      },
      {
        concept: 'Hora de Mano de Obra Oficial',
        description: 'Tiempo de trabajo del técnico instalador para operaciones generales, reparaciones complejas o diagnósticos in situ.',
        price: 40.00,
        category: 'mano_obra'
      }
    ]
  },
  {
    id: 'no_enciende',
    symptom: 'No enciende / Muerto total',
    icon: 'PowerOff',
    description: 'La máquina no responde al mando a distancia, no enciende ningún LED luminoso en el panel frontal.',
    checks: [
      '¿Hay corriente eléctrica en el enchufe o interruptor magnetotérmico general del equipo?',
      '¿Las pilas del mando a distancia funcionan correctamente?',
      '¿Hay continuidad en el fusible protector de la placa electrónica exterior/interior?',
      '¿Se observan componentes quemados en la placa de control?'
    ],
    recommendedSolutions: [
      {
        concept: 'Sustitución de Placa Electrónica (Mano de obra)',
        description: 'Desconexión, desmontaje de placa de control principal dañada y montaje de nueva placa de recambio oficial de la marca (repuesto no incluido en tarifa).',
        price: 85.00,
        category: 'reparacion'
      },
      {
        concept: 'Hora de Mano de Obra Oficial',
        description: 'Tiempo de trabajo del técnico instalador para operaciones generales, reparaciones complejas o diagnósticos in situ.',
        price: 40.00,
        category: 'mano_obra'
      },
      {
        concept: 'Desplazamiento Técnico (Radio <20km)',
        description: 'Gastos de viaje y transporte de herramientas y equipo hasta el domicilio o comercio del cliente (dentro del radio urbano de actuación).',
        price: 30.00,
        category: 'mano_obra'
      }
    ]
  }
];
