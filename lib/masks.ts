// Função para formatar CNPJ: 00.000.000/0000-00
export function maskCNPJ(value: string): string {
  // Remove caracteres não numéricos
  const cnpj = value.replace(/\D/g, "");

  // Aplica a máscara
  return cnpj
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
}

// Função para remover a formatação do CNPJ
export function unmaskCNPJ(value: string): string {
  return value.replace(/\D/g, "");
}

// Função para formatar telefone: (00) 00000-0000 ou (00) 0000-0000
export function maskPhone(value: string): string {
  // Remove caracteres não numéricos
  const phone = value.replace(/\D/g, "");

  // Verifica se é celular (com 9 dígitos) ou telefone fixo (com 8 dígitos)
  if (phone.length <= 10) {
    return phone
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 14);
  } else {
    return phone
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  }
}

// Função para remover a formatação do telefone
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, "");
}

// Função para formatar CEP: 00000-000
export function maskCEP(value: string): string {
  // Remove caracteres não numéricos
  const cep = value.replace(/\D/g, "");

  // Aplica a máscara
  return cep.replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
}

// Função para remover a formatação do CEP
export function unmaskCEP(value: string): string {
  return value.replace(/\D/g, "");
}
