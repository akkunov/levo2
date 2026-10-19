
'use client';

import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/product-form';

export default function EditProductPage() {
    const params = useParams<{ id: string }>();
    const productId = Number(params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
        return <div className="admin-section">Некорректный ID товара.</div>;
    }

    return <ProductForm productId={productId} />;
}
