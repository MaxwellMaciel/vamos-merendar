import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BackButton from '../components/ui/BackButton';
import { HelpCircle, ChevronDown, ChevronUp, AlignLeft, Calendar, Coffee, QrCode, User, Clock, LockKeyhole, MessagesSquare } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/settings" label="Ajuda e Suporte" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-4">
            <HelpCircle size={36} className="text-muted-foreground" />
          </div>
          
          <h2 className="text-xl font-semibold text-foreground">Como podemos ajudar?</h2>
          <p className="text-muted-foreground text-center mt-2">Encontre respostas para as dúvidas mais comuns</p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem value="item-1" className="border border-border rounded-lg px-4 bg-card shadow-md hover:shadow-lg transition-all duration-200">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center">
                <AlignLeft size={16} className="text-primary mr-3" />
                <span className="text-left font-medium text-foreground">Como funciona o sistema de refeições?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1 text-muted-foreground">
              <p className="mb-2">
                O sistema de refeições é projetado para otimizar o serviço do refeitório e reduzir o desperdício de alimentos.
              </p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Confirme sua presença para cada refeição com antecedência.</li>
                <li>Você pode confirmar ou cancelar sua presença até 2 horas antes do horário da refeição.</li>
                <li>Ao confirmar, um QR Code será gerado para validar sua presença no refeitório.</li>
                <li>Após a refeição, você pode deixar um feedback sobre a qualidade da comida.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border border-border rounded-lg px-4 bg-card shadow-md hover:shadow-lg transition-all duration-200">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center">
                <QrCode size={16} className="text-primary mr-3" />
                <span className="text-left font-medium text-foreground">Como usar o QR Code para confirmar presença?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1 text-muted-foreground">
              <p className="mb-2">
                Para confirmar sua presença em uma refeição, você deve utilizar o QR Code disponível no aplicativo.
              </p>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Na tela principal, selecione a refeição que deseja confirmar presença.</li>
                <li>Toque no botão "Gerar QR Code" para exibir seu código único.</li>
                <li>Apresente este QR Code ao responsável no refeitório.</li>
                <li>Após a leitura do código, sua presença será automaticamente registrada no sistema.</li>
              </ol>
              <p className="mt-2">
                Lembre-se que o QR Code é pessoal e intransferível, e só pode ser usado uma vez por refeição.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border border-border rounded-lg px-4 bg-card shadow-md hover:shadow-lg transition-all duration-200">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center">
                <Coffee size={16} className="text-primary mr-3" />
                <span className="text-left font-medium text-foreground">Como informar restrições alimentares?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1 text-muted-foreground">
              <p className="mb-2">
                É muito importante que você informe suas restrições alimentares para que a equipe da cozinha possa preparar alternativas adequadas para você.
              </p>
              <p className="mb-2">
                Para informar ou atualizar suas restrições alimentares:
              </p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Acesse o menu "Configurações" no canto inferior direito da tela.</li>
                <li>Selecione a opção "Restrições Alimentares".</li>
                <li>Escolha se você tem ou não restrições alimentares.</li>
                <li>Se tiver, descreva detalhadamente suas restrições no campo apropriado.</li>
                <li>Toque em "Salvar Alterações" para confirmar.</li>
              </ol>
              <p className="mt-2">
                Suas restrições ficarão visíveis para a equipe de nutrição, que adaptará o cardápio para suas necessidades sempre que possível.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-border rounded-lg px-4 bg-card shadow-md hover:shadow-lg transition-all duration-200">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center">
                <Calendar size={16} className="text-primary mr-3" />
                <span className="text-left font-medium text-foreground">Como ver o cardápio da semana?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1 text-muted-foreground">
              <p className="mb-2">
                O cardápio da semana está sempre disponível para consulta no aplicativo.
              </p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Na tela principal, você encontra o cardápio do dia atual.</li>
                <li>Para ver os próximos dias, deslize o calendário para a direita.</li>
                <li>Cada refeição mostra os pratos principais e as opções disponíveis.</li>
                <li>Refeições especiais ou alterações são destacadas em cores diferentes.</li>
              </ol>
              <p className="mt-2">
                O cardápio é atualizado semanalmente pela equipe de nutrição.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border border-border rounded-lg px-4 bg-card shadow-md hover:shadow-lg transition-all duration-200">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center">
                <User size={16} className="text-primary mr-3" />
                <span className="text-left font-medium text-foreground">Como atualizar meus dados pessoais?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1 text-muted-foreground">
              <p className="mb-2">
                Mantenha seus dados sempre atualizados para garantir o melhor funcionamento do sistema.
              </p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Acesse o menu "Configurações".</li>
                <li>Toque em "Dados Pessoais".</li>
                <li>Você pode atualizar seu nome, e-mail e telefone.</li>
                <li>Para alterar sua foto de perfil, toque sobre ela.</li>
                <li>Após as alterações, toque em "Salvar".</li>
              </ol>
              <p className="mt-2">
                Suas informações são protegidas e só serão usadas para fins relacionados ao serviço de refeições.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border border-border rounded-lg px-4 bg-card shadow-md hover:shadow-lg transition-all duration-200">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center">
                <LockKeyhole size={16} className="text-primary mr-3" />
                <span className="text-left font-medium text-foreground">Como alterar minha senha?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1 text-muted-foreground">
              <p className="mb-2">
                Por segurança, recomendamos trocar sua senha periodicamente.
              </p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Acesse o menu "Configurações".</li>
                <li>Selecione "Alterar Senha".</li>
                <li>Digite sua senha atual.</li>
                <li>Digite e confirme sua nova senha.</li>
                <li>Toque em "Confirmar" para salvar.</li>
              </ol>
              <p className="mt-2">
                Escolha uma senha forte, com pelo menos 8 caracteres, incluindo letras, números e símbolos.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="border border-border rounded-lg px-4 bg-card shadow-md hover:shadow-lg transition-all duration-200">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center">
                <Clock size={16} className="text-primary mr-3" />
                <span className="text-left font-medium text-foreground">Qual o horário das refeições?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1 text-muted-foreground">
              <p className="mb-3">
                Os horários padrão das refeições são:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between px-3 py-2 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="font-medium text-foreground">Café da manhã:</span>
                  <span className="text-foreground">7:00 - 8:00</span>
                </div>
                <div className="flex justify-between px-3 py-2 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="font-medium text-foreground">Almoço:</span>
                  <span className="text-foreground">11:30 - 13:30</span>
                </div>
                <div className="flex justify-between px-3 py-2 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="font-medium text-foreground">Lanche:</span>
                  <span className="text-foreground">15:30 - 16:30</span>
                </div>
              </div>
              <p className="mt-3">
                Estes horários podem variar dependendo do calendário escolar ou eventos especiais. Qualquer alteração será comunicada com antecedência.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Help;
