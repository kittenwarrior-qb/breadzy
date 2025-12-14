import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

interface FaqItem {
  question: string;
  answer: string;
  active?: boolean;
}

@Component({
  selector: 'app-faq-section',
  imports: [CommonModule, NzCollapseModule],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.css'
})
export class FaqSection {
  faqData: FaqItem[] = [
    {
      question: 'Làm thế nào để đặt bánh mì?',
      answer: 'Bạn có thể đặt bánh mì trực tiếp tại cửa hàng, qua điện thoại hoặc đặt hàng online trên website của chúng tôi. Chúng tôi cũng hỗ trợ giao hàng tận nơi trong bán kính 2km miễn phí cho đơn hàng từ 200.000đ.',
      active: false
    },
    {
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng trung bình là 30-45 phút tùy thuộc vào khoảng cách và lưu lượng giao thông. Đối với đơn hàng đặt trước, chúng tôi sẽ giao đúng giờ theo yêu cầu của bạn.',
      active: false
    },
    {
      question: 'Bánh mì của bạn được làm từ nguyên liệu gì?',
      answer: 'Chúng tôi sử dụng 100% nguyên liệu tươi ngon, bột mì cao cấp, men tự nhiên và không sử dụng chất bảo quản. Tất cả sản phẩm đều được làm thủ công mỗi ngày bởi đội ngũ thợ bánh chuyên nghiệp.',
      active: false
    },
    {
      question: 'Bánh mì có thể bảo quản được bao lâu?',
      answer: 'Bánh mì tươi ngon nhất trong ngày làm ra. Bạn có thể bảo quản ở nhiệt độ phòng trong 1-2 ngày hoặc trong tủ lạnh 3-4 ngày. Để giữ độ giòn, bạn có thể hâm nóng lại trong lò nướng trước khi ăn.',
      active: false
    },
    {
      question: 'Tôi có thể đặt bánh mì số lượng lớn không?',
      answer: 'Có, chúng tôi nhận đặt hàng số lượng lớn cho các sự kiện, tiệc tùng, họp mặt. Vui lòng đặt trước ít nhất 24 giờ để chúng tôi chuẩn bị tốt nhất. Liên hệ hotline để được tư vấn và báo giá ưu đãi.',
      active: false
    },
    {
      question: 'Có các loại bánh mì chay không?',
      answer: 'Có, chúng tôi có nhiều loại bánh mì chay như bánh mì trứng ốp la, bánh mì chay đậu hũ, bánh mì chay nấm. Tất cả đều được làm từ nguyên liệu chay 100% và rất thơm ngon.',
      active: false
    },
    {
      question: 'Tôi có thể thanh toán bằng cách nào?',
      answer: 'Chúng tôi chấp nhận thanh toán bằng tiền mặt, chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay, VNPay) và các thẻ tín dụng/ghi nợ phổ biến.',
      active: false
    },
    {
      question: 'Có chương trình khuyến mãi nào không?',
      answer: 'Chúng tôi thường xuyên có các chương trình khuyến mãi, giảm giá vào các dịp lễ tết và cuối tuần. Theo dõi fanpage và website để cập nhật các ưu đãi mới nhất. Khách hàng thân thiết sẽ được tích điểm và nhận nhiều ưu đãi đặc biệt.',
      active: false
    }
  ];
}
