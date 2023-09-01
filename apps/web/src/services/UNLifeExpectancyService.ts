import axios from 'axios';

const baseURL = 'https://population.un.org/dataportalapi/uiapi/v1/data/indicators/76';

const locationCodes = new Map<string, number>();
locationCodes.set('CANADA', 124);
locationCodes.set('FRANCE', 250);

const ageCodes = new Map<number, number>();
ageCodes.set(0, 42);
ageCodes.set(1, 89);
ageCodes.set(2, 117);
ageCodes.set(3, 126);
ageCodes.set(4, 90);
ageCodes.set(5, 152);
ageCodes.set(6, 161);
ageCodes.set(7, 170);
ageCodes.set(8, 90);
ageCodes.set(9, 179);
ageCodes.set(10, 91);
ageCodes.set(11, 109);
ageCodes.set(12, 110);
ageCodes.set(13, 111);
ageCodes.set(14, 112);
ageCodes.set(15, 86);
ageCodes.set(16, 113);
ageCodes.set(17, 114);
ageCodes.set(18, 115);
ageCodes.set(19, 116);
ageCodes.set(20, 92);
ageCodes.set(21, 118);
ageCodes.set(22, 119);
ageCodes.set(23, 120);
ageCodes.set(24, 121);
ageCodes.set(25, 93);
ageCodes.set(26, 122);
ageCodes.set(27, 123);
ageCodes.set(28, 124);
ageCodes.set(29, 125);
ageCodes.set(30, 94);
ageCodes.set(31, 127);
ageCodes.set(32, 128);
ageCodes.set(33, 129);
ageCodes.set(34, 130);
ageCodes.set(35, 95);
ageCodes.set(36, 131);
ageCodes.set(37, 132);
ageCodes.set(38, 133);
ageCodes.set(39, 134);
ageCodes.set(40, 96);
ageCodes.set(41, 136);
ageCodes.set(42, 137);
ageCodes.set(43, 138);
ageCodes.set(44, 139);
ageCodes.set(45, 97);
ageCodes.set(46, 140);
ageCodes.set(47, 141);
ageCodes.set(48, 142);
ageCodes.set(49, 143);
ageCodes.set(50, 98);
ageCodes.set(51, 144);
ageCodes.set(52, 145);
ageCodes.set(53, 146);
ageCodes.set(54, 147);
ageCodes.set(55, 99);
ageCodes.set(56, 148);
ageCodes.set(57, 149);
ageCodes.set(58, 150);
ageCodes.set(59, 151);
ageCodes.set(60, 87);
ageCodes.set(61, 153);
ageCodes.set(62, 154);
ageCodes.set(63, 155);
ageCodes.set(64, 156);
ageCodes.set(65, 100);
ageCodes.set(66, 157);
ageCodes.set(67, 158);
ageCodes.set(68, 159);
ageCodes.set(69, 160);
ageCodes.set(70, 101);
ageCodes.set(71, 162);
ageCodes.set(72, 163);
ageCodes.set(73, 164);
ageCodes.set(74, 165);
ageCodes.set(75, 102);
ageCodes.set(76, 166);
ageCodes.set(77, 167);
ageCodes.set(78, 168);
ageCodes.set(79, 169);
ageCodes.set(80, 88);
ageCodes.set(81, 171);
ageCodes.set(82, 172);
ageCodes.set(83, 173);
ageCodes.set(84, 174);
ageCodes.set(85, 103);
ageCodes.set(86, 175);
ageCodes.set(87, 176);
ageCodes.set(88, 177);
ageCodes.set(89, 178);
ageCodes.set(90, 104);
ageCodes.set(91, 180);
ageCodes.set(92, 181);
ageCodes.set(93, 182);
ageCodes.set(94, 183);
ageCodes.set(95, 105);
ageCodes.set(96, 184);
ageCodes.set(97, 185);
ageCodes.set(98, 186);
ageCodes.set(99, 187);
ageCodes.set(100, 59);

const sexCodes = new Map<string, number>();
sexCodes.set('M', 1);
sexCodes.set('F', 2);
sexCodes.set('X', 3);

const controller = new AbortController();

// https://population.un.org/dataportal/data/indicators/76/locations/124/start/2023/end/2023/table/pivotbylocation
export async function getLifeExpectancy(location: string, sex: string, currentAge: number) {
  const locationCode = locationCodes.get(location.toUpperCase()) ?? 0;
  const ageCode = ageCodes.get(currentAge) ?? ageCodes.get(0);
  const sexCode = sexCodes.get(sex) ?? sexCodes.get('X');

  const currentYear = (new Date()).getFullYear();
  const response = await axios
  .get(`${baseURL}/locations/${locationCode}/years/${currentYear},${currentYear}/vars/4/ages/${ageCode}/sexes/${sexCode}/cats/0`, {
    signal: controller.signal
  });

  const data = response.data[0];
  console.assert(data.locationId === locationCode, data);
  console.assert(data.ageLabel == currentAge, data);
  // console.assert(data.sex === sex, data);
  return data;
}
