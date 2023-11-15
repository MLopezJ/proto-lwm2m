import { Type } from '@sinclair/typebox'
/**
 * Connection information: Details about the device's connection.
 */
export const Connectioninformation_14203 = Type.Object(
	{
		ObjectVersion: Type.Optional(Type.String({ examples: ['1.0'] })),
		ObjectID: Type.Number({ examples: [14203] }),
		Resources: Type.Object({
			0: Type.Optional(
				Type.String({
					title: 'Network mode',
					description: 'Examples: LTE-M, NB-IoT.',
				}),
			),
			1: Type.Optional(
				Type.Integer({
					title: 'Band',
					description:
						'E-UTRA Absolute Radio Frequency Channel Number (EARFCN) of the current cell where the EARFCN is as defined in 3GPP TS 36.101. LTE carrier channel number for unique identification of LTE band and carrier frequency. Examples: 262143',
				}),
			),
			2: Type.Optional(
				Type.Integer({
					title: 'RSRP',
					description:
						'Reference Signal Received Power (RSRP). The average power level in dBm received from a single reference signal in an LTE (Long-term Evolution) network. Typically this value ranges from -140 to -40 dBm. Examples: -97, -104.',
				}),
			),
			3: Type.Optional(
				Type.Integer({ title: 'Area', description: 'Area code. Examples: 12' }),
			),
			4: Type.Optional(
				Type.Integer({
					title: 'Cell',
					description:
						'The cell ID the User Equipment (UE) is camped on. 4-byte Evolved Terrestrial Radio Access Network (E-UTRAN) cell ID. Examples: 33703719',
				}),
			),
			5: Type.Optional(
				Type.Integer({
					title: 'Mobile country code and mobile network code',
					description: 'Examples: 24202, 310410',
				}),
			),
			6: Type.Optional(
				Type.String({
					title: 'IP address',
					description:
						'Examples: 10.81.183.99, 2001:0db8:85a3:0000:0000:8a2e:0370:7334, 2001:db8:85a3::8a2e:370:7334',
				}),
			),
			11: Type.Optional(
				Type.Integer({
					title: 'Energy Estimate',
					description:
						'The %CONEVAL AT command returns amongst other data the energy estimate: Relative estimated energy consumption of data transmission compared to nominal consumption. A higher value means smaller energy consumption. 5: Difficulties in setting up connections. Maximum number of repetitions might be needed for data. 6: Poor conditions. Setting up a connection might require retries and a higher number of repetitions for data. 7: Normal conditions for cIoT device. No repetitions for data or only a few repetitions in the worst case. 8: Good conditions. Possibly very good conditions for small amounts of data. 9: Very good conditions. Efficient data transfer estimated also for larger amounts of data. Examples: 5, 7',
				}),
			),
			99: Type.Date({
				title: 'Timestamp',
				description: 'The timestamp of when the measurement was performed.',
			}),
		}),
	},
	{ description: "Details about the device's connection." },
)
