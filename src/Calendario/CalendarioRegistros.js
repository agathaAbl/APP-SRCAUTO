import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MagnifyingGlass } from 'phosphor-react-native';
import styles from './CalendarRegistroStyles';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
};
LocaleConfig.defaultLocale = 'pt-br';

export default function CalendarioRegistros({ dataSelecionada, setDataSelecionada }) {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const ano = dataSelecionada.getFullYear();
  const mes = dataSelecionada.getMonth();
  const dia = dataSelecionada.getDate();
  const dataFormatada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  
  return (
    <View>
      <TouchableOpacity style={styles.lupaBtn} onPress={() => setMostrarCalendario(true)}>
        <MagnifyingGlass size={22} color="#fff" />
      </TouchableOpacity>

      <Modal visible={mostrarCalendario} transparent animationType="fade" onRequestClose={() => setMostrarCalendario(false)}>
        <TouchableWithoutFeedback onPress={() => setMostrarCalendario(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.calendarioWrapper}>
                <Calendar
                  current={dataFormatada}
                  onDayPress={(day) => {
                    const novaData = new Date(day.dateString + 'T12:00:00');
                    setDataSelecionada(novaData);
                    setMostrarCalendario(false);
                  }}
                  markedDates={{
                    [dataFormatada]: { selected: true, selectedColor: '#25c7a4' },
                  }}
                  // ✅ Limites de data para testes
                  maxDate={new Date().toISOString().split('T')[0]}
                  minDate={'2020-01-01'}
                  theme={{
                    calendarBackground: '#f5f0eb',
                    backgroundColor: '#f5f0eb',
                    textSectionTitleColor: '#25c7a4',   
                    selectedDayBackgroundColor: '#25c7a4',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#ffffff',
                    todayBackgroundColor: '#25c7a4',
                    dayTextColor: '#25c7a4',            
                    textDisabledColor: '#b0ddd5',
                    dotColor: '#25c7a4',
                    monthTextColor: '#25c7a4',        
                    arrowColor: '#25c7a4',
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
