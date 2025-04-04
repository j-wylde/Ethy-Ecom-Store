
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderEmailRequest {
  to_email: string;
  from_name: string;
  from_email: string;
  address: string;
  order_details: OrderItem[];
  total: number;
  notes: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OrderEmailRequest = await req.json();
    
    // Generate the HTML for the product table
    const productsTable = data.order_details.map(item => 
      `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.product_name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join("");

    const emailResponse = await resend.emails.send({
      from: "Orders <onboarding@resend.dev>",
      to: ["yung.jeri56@gmail.com"],
      subject: "New Order Notification",
      html: `
        <h1>New Order Received</h1>
        <p><strong>Customer:</strong> ${data.from_name}</p>
        <p><strong>Email:</strong> ${data.from_email}</p>
        <p><strong>Shipping Address:</strong> ${data.address}</p>
        
        <h2>Order Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantity</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Price</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Total</th>
          </tr>
          ${productsTable}
          <tr>
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">$${data.total.toFixed(2)}</td>
          </tr>
        </table>
        
        <h3>Additional Notes</h3>
        <p>${data.notes || "No additional notes"}</p>
      `,
    });

    // Also send a confirmation email to the customer
    await resend.emails.send({
      from: "EnySkin <onboarding@resend.dev>",
      to: [data.from_email],
      subject: "Your Order Confirmation",
      html: `
        <h1>Thank You for Your Order!</h1>
        <p>Dear ${data.from_name},</p>
        <p>We have received your order and are processing it now. You will receive another email when your order ships.</p>
        
        <h2>Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantity</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Price</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Total</th>
          </tr>
          ${productsTable}
          <tr>
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">$${data.total.toFixed(2)}</td>
          </tr>
        </table>
        
        <p><strong>Shipping Address:</strong> ${data.address}</p>
        
        <p>Thank you for shopping with EnySkin!</p>
        <p>If you have any questions, please contact our customer service.</p>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
