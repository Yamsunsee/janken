const LINES = [
  "4 3 3 8 3 8 5 6 2 4 4 2 2 6 2 3 5 6 2 2 2 2 6 6 5 3 2 5 2 5 3 5 2",
  "2 2 6 4 2 4 6 2 2 2 2 6 7 4 6 2 2 3 8 8 3 12 4 2 4 2 3 5 9 2 8 3",
  "3 6 10x 3x 5x 2 2x 2x 4x 6x 2x 2 2x 3x 2 3 3x 2x 2 6x 5 2x 4x 2 10x 9x 2 3x 2x 2 3 6x 2 3 3",
  "8 7 5x 3x 7x 2x 2 2x 2x 3x 7x 2x 2 7x 2 2 3x 2x 2 6x 4 4x 2x 3 3x 2x 2x 2x 7x 2 4x 2x 5 2x 3x 2 10 2",
  "4 3 4x 2x 2x 9x 2 4x 5x 6x 2x 2 2x 5x 4 3x 2x 2 2x 3x 3 7x 4 5x 4x 2x 3x 2x 2 8x 4 3x 2x 2 2 2",
  "2 10 13 3x 2x 2 3 2 3x 2x 2 3 6x 2 9x 3 2x 3x 2 6x 2 4x 2x 5 2x 3x 3 2 6 2 4x 4x 3 3x 2x 7 2 9",
  "5 4 2 3 3 3x 2x 2 3 2 6x 3 2 6x 2 3x 6x 2 3x 2x 2 2x 3x 1 2x 4x 3 3 3x 2x 8 4 2 2x 3x 3x 2 3x 2x 4 9",
  "5 2 3 4 3x 2x 2 6 3x 2x 3 2 2x 3x 2 7x 4x 1 6x 2 2x 6x 4x 4 3 2x 3x 2 4 5 2 6x 5x 1 3x 2x 5 4",
  "2 2 5 5 2 2 6x 9 6x 3x 3x 5x 2 2x 2x 7x 6x 2 7x 2x 2x 2 2 3 8x 2x 8x 2 13x 2x 3x 11 4",
  "13 3 2 6 2x 3x 4 4 5x 3x 4x 5x 2 6x 6x 3x 2x 2 8x 3x 4 2 2 6x 2x 5x 4x 2 7x 2x 2x 3x 2x 5 2 11",
  "2 4 4 2 9 2x 3x 3 2 2 2x 3x 3x 2x 2x 3x 2 7x 2x 2x 2x 3x 2 2x 5x 4x 6 2 2x 2x 4x 5x 3x 2 2x 2x 7x 6x 4 2 10",
  "5 3 2 2 3 3x 2x 2 2 3 3x 2x 3 2 6x 2 6x 1 7x 4x 2 2x 2x 8x 5 2 3x 2x 2 3 6 2 2x 3x 1 5x 2x 3x 3 2 5",
  "2 2 4 3 2 3 3x 2x 3 5 6x 6 6x 2 6x 2 10x 2 3x 2x 1 7x 7 6x 2 5 4 2 6x 2 3x 6x 2 4 6",
  "5 5 11 2x 3x 2 3 2 2x 3x 6 3x 2x 2 3x 2x 3 3x 2x 2x 2 2x 3x 2 3x 3x 2 2 3x 2x 13 2 6x 3 2x 2x 3x 12 3",
  "8 3 8x 4x 6 2 2x 3x 3 2 3x 2x 2 3x 2x 4 2x 2x 2x 2 2x 3x 3 7x 4 9x 2x 7x 2 2x 3x 4 4x 3x 7 4",
  "2 2 10 7x 2x 2x 2 6 3x 2x 3 2 6x 2 3x 2x 2 2 3x 3x 2 3x 2x 4 2x 4x 3 2x 3x 2x 3x 6x 2 3x 2x 5 4x 2x 9 6",
  "2 2 4 2x 5x 4x 2 2 3 2x 3x 3 2 6x 2 2x 3x 3 2 2x 3x 2 3x 2x 2 2 4x 2x 2 2x 2x 4x 2x 2x 3x 2 2x 3x 6 2x 3x 2 4 2",
  "2 6 2 4 2 4 5 6 5 6 5 6 2 9 6 2 2 5 2 3 3 8 5 6 2 3 5 6 2 2 2 2 6",
  "4 3 2 4 4 2 3 5 4 7 4 2 4 4 2 4 6 2 2 6 2 2 2 9 5 2 3 9 2 2 2 6 4 3",
];
const CHOICES = { r: "rock", p: "paper", s: "scissors", x: "none" };
const ICONS = {
  win: { name: "checkmark-circle", color: "text-green-400" },
  lose: { name: "close-circle", color: "text-red-400" },
  draw: { name: "remove-circle", color: "text-blue-400" },
  none: { name: "ellipse", color: "text-[#ccc]" },
};
const PATH = "http://localhost:5000";
const SIGN_UP = `${PATH}/users/signup`;
const SIGN_IN = `${PATH}/users/signin`;
const INVITATIONS = (userId, recipientId = "") => `${PATH}/users/${userId}/invitations/${recipientId}`;
const FRIENDS = (userId, recipientId = "") => `${PATH}/users/${userId}/friends/${recipientId}`;

export { LINES, CHOICES, ICONS, PATH, SIGN_UP, SIGN_IN, INVITATIONS, FRIENDS };
