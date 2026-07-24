import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { toast } from 'react-toastify'; // 👈 Toast import edildi

const SiparisTakip = ({ uyeId }) => {
    useEffect(() => {
        if (!uyeId) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5000/Hubs/SiparisHub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log("🟢 SignalR Bağlantısı Başarılı!");
                connection.invoke("JoinCustomerGroup", Number(uyeId));
            })
            .catch(err => console.error("🔴 SignalR Hatası: ", err));

        connection.on("SiparisDurumGuncellendi", (data) => {
            // alert yerine doğrudan projedeki ToastContainer'a bildirim fırlatır
            toast.info(`📦 Sipariş #${data.siparisId}: ${data.mesaj}`, {
                position: "top-right",
                autoClose: 5000,
            });
        });

        return () => {
            connection.stop();
        };
    }, [uyeId]);

    return null; 
};

export default SiparisTakip;