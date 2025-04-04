const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE"; // Letras asignadas según el resto

export const validateDni = (dni: string): boolean => {
    // Expresión regular para verificar el formato
    const dniRegex = /^\d{8}[A-Za-z]$/;
    if (!dniRegex.test(dni)) return false;

    // Extraer número y letra
    const numberPart = parseInt(dni.slice(0, 8), 10);
    const letterPart = dni.slice(8).toUpperCase();

    // Calcular la letra correcta
    const correctLetter = DNI_LETTERS[numberPart % 23];

    // Comparar con la letra proporcionada
    return letterPart === correctLetter;
};