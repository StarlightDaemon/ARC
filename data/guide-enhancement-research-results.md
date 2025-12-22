# Guide Enhancement Research Results

Research from LLM analysis on what technical data XDA power users need in accessory guides.

---

## Key Findings: New Data Points to Add

### 1. Chargers - PPS Protocol Details
| Column | Example Values |
|--------|---------------|
| **PPS Range** | 3.3V-11V @ 5A, None |
| **E-Marker Required** | Yes (5A), No (3A) |
| **Safety Certs** | USB-IF, UL, CE |

**Why:** "100W" charger may only deliver 15W to phone if missing PPS support.

---

### 2. USB-C Hubs - Power Budget
| Column | Example Values |
|--------|---------------|
| **Power Reservation** | 15W (Device gets 30W from 45W input) |
| **Idle Power Draw** | 0.4W (Efficient) / 2.5W (High) |
| **PPS Passthrough** | Yes / No |
| **DP Version** | 1.2 (4K30) / 1.4 (4K60+USB3) |

**Why:** Hub "steals" power before passing to phone. Critical for DeX users.

---

### 3. Audio Dongles - Impedance Data
| Column | Example Values |
|--------|---------------|
| **Output Impedance** | 0.2Ω (IEM Safe) / 5.0Ω (High) |
| **SINAD** | 110dB+ (Excellent) / 90dB (Basic) |
| **Idle Power Draw** | <20mA (Low) / 150mA (High) |
| **DAC Chip** | ESS 9281, CX31993 |

**Why:** High impedance ruins IEM sound signature. Power draw kills battery.

---

### 4. Screen Protectors - Safety Flags
| Column | Example Values |
|--------|---------------|
| **Adhesion Type** | LOCA (UV Glue) / Dry / Wet |
| **Liquid Risk** | ⚠️ High (No mask) / Safe |
| **Biometric** | Ultrasonic Compatible / Cutout / Incompatible |
| **Case Fit** | Full Curve / Case Friendly |

**Why:** LOCA glue can permanently damage speakers if no safety kit included.

---

### 5. Cases - EMI & Thermal Warnings
| Column | Example Values |
|--------|---------------|
| **S Pen Safe** | ✅ Verified / ⚠️ Magnets (Risk) |
| **Coil Alignment** | Model-Specific / Generic |
| **Thermal** | Open Back / Insulated |

**Why:** Wrong magnets create S Pen dead zones. Poor thermal = throttled chip.

---

### 6. Controllers - Precision Gaming
| Column | Example Values |
|--------|---------------|
| **Sensor Type** | Hall Effect (No Drift) / ALPS (Potentiometer) |
| **Polling Rate** | 1000Hz (1ms) / 125Hz (8ms) |
| **Connection** | USB-C Direct / Bluetooth |

**Why:** Hall Effect eliminates stick drift. Polling rate = input latency.

---

## Implementation Priority

1. **Chargers** - Add PPS column (HIGH - affects all users)
2. **Screen Protectors** - Add safety flags (HIGH - prevents damage)
3. **Cases** - Add S Pen/EMI warnings (MEDIUM - Samsung users)
4. **Hubs** - Add power budget (MEDIUM - DeX users)
5. **Audio** - Add impedance (LOW - audiophile niche)
6. **Controllers** - Add sensor type (LOW - gaming niche)

---

## BBCode Implementation

Use `[SPOILER]` for advanced specs to keep main tables clean:

```bbcode
[TABLE]
[TR][TH]Brand[/TH][TH]Model[/TH][TH]Watts[/TH][TH]PPS[/TH][TH]Links[/TH][/TR]
[TR][TD]Anker[/TD][TD]313[/TD][TD]45W[/TD][TD]✅ 3.3-11V[/TD][TD]$35[/TD][/TR]
[/TABLE]

[SPOILER=Technical Details]
- PPS Range: 3.3V-11V @ 5A
- Fixed PDOs: 5V/3A, 9V/3A, 15V/3A, 20V/2.25A
- E-Marker: Not required (3A max)
- Safety: USB-IF Certified
[/SPOILER]
```
