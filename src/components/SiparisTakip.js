import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { toast } from 'react-toastify'; // 👈 Toast import edildi

const SiparisTakip = ({ uyeId }) => {
    useEffect(() => {
        if (!uyeId) return;

        // 🔑 React StrictMode (dev modunda) her effect'i mount->unmount->mount
        // şeklinde iki kez çalıştırır. connection.start() tamamlanmadan ilk
        // unmount'ta connection.stop() çağrılırsa SignalR "AbortError: stopped
        // during negotiation" fırlatır. Bu zararsızdır (sadece dev'de olur,
        // production build'de görünmez) ama konsolu kirletiyor. isActive guard'ı
        // ile bu durumda hatayı sessizce yutuyoruz.
        let isActive = true;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5141/Hubs/SiparisHub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                if (!isActive) {
                    // Bileşen zaten unmount oldu, gereksiz bağlantıyı kapat.
                    connection.stop();
                    return;
                }
                console.log("🟢 SignalR Bağlantısı Başarılı!");
                connection.invoke("JoinCustomerGroup", Number(uyeId));
            })
            .catch(err => {
                if (isActive) {
                    console.error("🔴 SignalR Hatası: ", err);
                }
                // isActive false ise bu, normal StrictMode kaynaklı iptal —
                // görmezden gel.
            });

        connection.on("SiparisDurumGuncellendi", (data) => {
            // alert yerine doğrudan projedeki ToastContainer'a bildirim fırlatır
            toast.info(`📦 Sipariş #${data.siparisId}: ${data.mesaj}`, {
                position: "top-right",
                autoClose: 5141,
            });
        });

        return () => {
            isActive = false;
            connection.stop();
        };
    }, [uyeId]);

    return null; 
};

export default SiparisTakip;